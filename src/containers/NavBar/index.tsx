import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
// import { LogoutIcon } from '../../assets/images/LogoutIcon';
// import { Moon } from '../../assets/images/Moon';
import { AvatarIcon, CloseIcon, OpenIcon } from '../../assets/images/NavBarIcons';
// import { Sun } from '../../assets/images/Sun';
import { colors, pgRoutes } from '../../constants';
import { buildPath } from '../../custom/helpers';
import {
    changeColorTheme,
    changeLanguage,
    logoutFetch,
    Market,
    openGuardModal,
    RootState,
    selectAppVersion,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectUserInfo,
    selectUserLoggedIn,
    User,
    walletsReset,
} from '../../modules';

export interface ReduxProps {
    colorTheme: string;
    currentMarket: Market | undefined;
    address: string;
    isLoggedIn: boolean;
    lang: string;
    success?: boolean;
    user: User;
    version: string;
    currentLanguage: string;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
    changeLanguage: typeof changeLanguage;
    logout: typeof logoutFetch;
    walletsReset: typeof walletsReset;
    openGuardModal: typeof openGuardModal;
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}

type NavbarProps = OwnProps & ReduxProps & RouteProps & DispatchProps;

interface NavbarState {
    isOpen: boolean;
    isOpenLanguage: boolean;
    email: string;
    message: string;
    name: string;
    recaptchaResponse: string;
    errorModal: boolean;
}

// tslint:disable:jsx-no-lambda
class NavBarComponent extends React.Component<NavbarProps, NavbarState> {
    public readonly state = {
        isOpen: false,
        isOpenLanguage: false,
        email: '',
        name: '',
        message: '',
        recaptchaResponse: '',
        errorModal: false,
    };

    public navItem = (address: string, onLinkChange?: () => void) => (values: string[], index: number) => {
        const [name, url] = values;
        const { currentMarket, isLoggedIn, lang } = this.props;
        const cx = classnames('pg-navbar__content-item', {
            'pg-navbar__content-item--active': this.shouldUnderline(address, buildPath(url, lang), lang),
            'pg-navbar__content-item-logging': isLoggedIn,
        });
        const handleLinkChange = () => {
            if (onLinkChange) {
                onLinkChange();
            }
        };
        const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
        return (
            <li key={index}>
                <Link className={cx} to={buildPath(path, lang)} onClick={handleLinkChange}>
                    <FormattedMessage id={name} />
                </Link>
            </li>
        );
    };
    //tslint:disable
    public render() {
        const {
            // colorTheme,
            lang,
            location,
            isLoggedIn,
            user,
        } = this.props;
        const { isOpenLanguage } = this.state;
        const address = location ? location.pathname : '';
        const languageName = lang === 'zh' ? 'CN' : lang.toUpperCase();
        const languageClassName = classnames('dropdown-menu-language-field', {
            'dropdown-menu-language-field-active': isOpenLanguage,
        });

        return (
            <div className={'pg-navbar'}>
                {user.state === 'active' ? this.getProfile() : null}
                <ul className="pg-navbar__content">
                    {pgRoutes(user.state === 'active' && isLoggedIn).map(this.navItem(address, this.props.onLinkChange))}
                </ul>
                <div className="pg-navbar__header-settings">
                    {/* <div className="pg-navbar__header-settings__switcher">
                        <div className="pg-navbar__header-settings__switcher__items" onClick={e => this.handleChangeCurrentStyleMode(colorTheme === 'light' ? 'basic' : 'light')}>
                            {this.getLightDarkMode()}
                        </div>
                    </div> */}
                    {user.state === 'active' && isLoggedIn ? this.getUserEmailMenu() : null}
                    <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-toggle dropdown-menu-language-container">
                        <div onClick={this.toggleLanguageMenu} className={languageClassName}>
                            {languageName}
                            {this.getLanguageMenuIcon()}
                        </div>
                        {isOpenLanguage ? this.getLanguageMenu() : null}
                    </div>
                </div>
                <div className="pg-navbar__header-language" onClick={this.toggleLanguageMenu}>
                    <span>LANGUAGE</span>
                    <span>
                        {languageName}
                        <img className="icon" src={require(`./${isOpenLanguage ? 'open' : 'close'}-icon.svg`)} />
                    </span>
                    {isOpenLanguage ? this.getLanguageMenu() : null}
                </div>
            </div>
        );
    }

    // private getLightDarkMode = () => {
    //     const { colorTheme } = this.props;

    //     if (colorTheme === 'basic') {
    //         return (
    //             <React.Fragment>
    //                 <div className="switcher-item">
    //                     <Sun fillColor={colors.light.navbar.sun}/>
    //                 </div>
    //                 <div className="switcher-item switcher-item--active">
    //                     <Moon fillColor={colors.light.navbar.moon}/>
    //                 </div>
    //             </React.Fragment>
    //         );
    //     }

    //     return (
    //         <React.Fragment>
    //             <div className="switcher-item switcher-item--active">
    //                 <Sun fillColor={colors.basic.navbar.sun}/>
    //             </div>
    //             <div className="switcher-item">
    //                 <Moon fillColor={colors.basic.navbar.moon}/>
    //             </div>
    //         </React.Fragment>
    //     );
    // };

    private getLanguageMenuIcon = () => {
        const { colorTheme } = this.props;
        const { isOpenLanguage } = this.state;

        if (colorTheme === 'light') {
            return isOpenLanguage ? (
                <span className="icon">
                    <OpenIcon fillColor={colors.light.navbar.language} />
                </span>
            ) : (
                <span className="icon">
                    <CloseIcon fillColor={colors.light.navbar.language} />
                </span>
            );
        }

        return isOpenLanguage ? (
            <span className="icon">
                <OpenIcon fillColor={colors.basic.navbar.language} />
            </span>
        ) : (
            <span className="icon">
                <CloseIcon fillColor={colors.basic.navbar.language} />
            </span>
        );
    };

    private shouldUnderline = (address: string, url: string, lang: string): boolean =>
        (url === buildPath('/trading/', lang) && address.includes('/trading')) || address === url;

    // tslint:disable
    private getProfile = () => {
        const { /*colorTheme,*/ lang, user } = this.props;

        return (
            <div className="pg-navbar__header-profile">
                <span>{user.email}</span>
                <Link
                    className="pg-navbar__admin-logout"
                    to={buildPath('/profile', lang)}
                    onClick={this.handleRouteChange(buildPath('/profile', lang))}
                >
                    <FormattedMessage id={'page.header.navbar.profile'} />
                </Link>
                <Link
                    className="pg-navbar__admin-logout"
                    to={buildPath('/referral', lang)}
                    onClick={this.handleRouteChange(buildPath('/referral', lang))}
                >
                    <FormattedMessage id={'page.header.navbar.refprogram'} />
                </Link>
                <Link
                    className="pg-navbar__admin-logout"
                    to={buildPath('/referral-tickets', lang)}
                    onClick={this.handleRouteChange(buildPath('/referral-tickets', lang))}
                >
                    <FormattedMessage id={'page.header.navbar.reftickets'} />
                </Link>
                <Link
                    className="pg-navbar__admin-logout"
                    to={buildPath('/referral-commission', lang)}
                    onClick={this.handleRouteChange(buildPath('/referral-commission', lang))}
                >
                    <FormattedMessage id={'page.header.navbar.refcommission'} />
                </Link>
                {/*<Link
                    className="pg-navbar__admin-logout"
                    to="/referral-commission"
                    onClick={this.handleRouteChange('/referral-commission')}
                >
                    <FormattedMessage id={'page.header.navbar.refcommission'} />
                </Link>*/}

                {/* <LogoutIcon
                    onClick={() => this.handleLogOut()}
                    className="pg-navbar__header-profile-logout"
                    fillColor={colorTheme === 'light' ? colors.light.navbar.logout : colors.basic.navbar.logout}
                />  */}
                <a className="pg-navbar__admin-logout" href="https://kb.emirex.com/" target="_blank" rel="nofollow noopener">
                    <FormattedMessage id={'footer_links_kb'} />
                </a>
                <a className="pg-navbar__admin-logout" onClick={this.handleLogOut}>
                    <FormattedMessage id={'page.header.navbar.logout'} />
                </a>
            </div>
        );
    };

    private getLanguageMenu = () => {
        return (
            <div className="dropdown-menu dropdown-menu-language" role="menu">
                <div className="dropdown-menu-item-lang" onClick={e => this.handleChangeLanguage('en')}>
                    EN
                </div>
                <div className="dropdown-menu-item-lang" onClick={e => this.handleChangeLanguage('ru')}>
                    RU
                </div>
                <div className="dropdown-menu-item-lang" onClick={e => this.handleChangeLanguage('cn')}>
                    CN
                </div>
            </div>
        );
    };

    private getUserEmailMenu = () => {
        const { isOpen } = this.state;
        const userClassName = classnames('navbar-user-menu', {
            'navbar-user-menu-active': isOpen,
        });

        return (
            <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-toggle">
                <div onClick={this.openMenu} className={userClassName}>
                    {this.getUserEmailMenuIcon()}
                </div>
                {isOpen ? this.getUserMenu() : null}
            </div>
        );
    };

    private getUserEmailMenuIcon = () => {
        const { colorTheme } = this.props;
        const { isOpen } = this.state;

        if (colorTheme === 'light') {
            return isOpen ? (
                <React.Fragment>
                    <AvatarIcon fillColor={colors.light.navbar.avatar} />
                    <span className="icon">
                        <OpenIcon fillColor={colors.light.navbar.avatar} />
                    </span>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <AvatarIcon fillColor={colors.light.navbar.avatar} />
                    <span className="icon">
                        <CloseIcon fillColor={colors.light.navbar.avatar} />
                    </span>
                </React.Fragment>
            );
        }

        return isOpen ? (
            <React.Fragment>
                <AvatarIcon fillColor={colors.basic.navbar.avatar} />
                <span className="icon">
                    <OpenIcon fillColor={colors.basic.navbar.avatar} />
                </span>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <AvatarIcon fillColor={colors.basic.navbar.avatar} />
                <span className="icon">
                    <CloseIcon fillColor={colors.basic.navbar.avatar} />
                </span>
            </React.Fragment>
        );
    };

    private getUserMenu = () => {
        const { lang } = this.props;

        return (
            <div className="dropdown-menu dropdown-menu-user" role="menu">
                <div className="dropdown-menu-item-user">
                    <Link
                        className="pg-navbar__admin-logout"
                        to={buildPath('/profile', lang)}
                        onClick={this.handleRouteChange(buildPath('/profile', lang))}
                    >
                        <FormattedMessage id={'page.header.navbar.profile'} />
                    </Link>
                </div>
                <div className="dropdown-menu-item-user">
                    <Link
                        className="pg-navbar__admin-logout"
                        to={buildPath('/referral', lang)}
                        onClick={this.handleRouteChange(buildPath('/referral', lang))}
                    >
                        <FormattedMessage id={'page.header.navbar.refprogram'} />
                    </Link>
                </div>
                <div className="dropdown-menu-item-user">
                    <Link
                        className="pg-navbar__admin-logout"
                        to={buildPath('/referral-tickets', lang)}
                        onClick={this.handleRouteChange(buildPath('/referral-tickets', lang))}
                    >
                        <FormattedMessage id={'page.header.navbar.reftickets'} />
                    </Link>
                </div>
                <div className="dropdown-menu-item-user">
                    <Link
                        className="pg-navbar__admin-logout"
                        to={buildPath('/referral-commission', lang)}
                        onClick={this.handleRouteChange(buildPath('/referral-commission', lang))}
                    >
                        <FormattedMessage id={'page.header.navbar.refcommission'} />
                    </Link>
                </div>
                <div className="dropdown-menu-item-user">
                    <a className="pg-navbar__admin-logout" href="https://kb.emirex.com/" target="_blank" rel="nofollow noopener">
                        <FormattedMessage id={'footer_links_kb'} />
                    </a>
                </div>
                <div className="dropdown-menu-item-user">
                    <a className="pg-navbar__admin-logout" onClick={this.handleLogOut}>
                        <FormattedMessage id={'page.header.navbar.logout'} />
                    </a>
                </div>
            </div>
        );
    };

    // private handleChangeCurrentStyleMode = (value: string) => {
    //     if (this.props.version === 'Lite') {
    //         this.props.openGuardModal();
    //     } else {
    //         this.props.changeColorTheme(value);
    //     }
    // };

    private handleRouteChange = (to: string) => () => {
        this.setState({ isOpen: false }, () => {
            this.props.history.push(to);
        });
    };

    private handleLogOut = () => {
        localStorage.removeItem('uil');
        localStorage.removeItem('refCode');
        localStorage.removeItem('usedCoins');
        this.setState(
            {
                isOpen: false,
            },
            () => {
                this.props.logout();
            }
        );
    };

    private openMenu = () => {
        this.setState(
            {
                isOpen: !this.state.isOpen,
            },
            () => {
                if (this.state.isOpen) {
                    document.addEventListener('click', this.closeMenu);
                } else {
                    document.removeEventListener('click', this.closeMenu);
                }
            }
        );
    };

    private closeMenu = () => {
        this.setState(
            {
                isOpen: false,
            },
            () => {
                document.removeEventListener('click', this.closeMenu);
            }
        );
    };

    private toggleLanguageMenu = () => {
        this.setState(
            {
                isOpenLanguage: !this.state.isOpenLanguage,
            },
            () => {
                if (this.state.isOpenLanguage) {
                    document.addEventListener('click', this.closeLanguageMenu);
                } else {
                    document.removeEventListener('click', this.closeLanguageMenu);
                }
            }
        );
    };

    private closeLanguageMenu = () => {
        this.setState(
            {
                isOpenLanguage: false,
            },
            () => {
                document.removeEventListener('click', this.closeLanguageMenu);
            }
        );
    };

    private handleChangeLanguage = (language: string) => {
        const lang = this.props.currentLanguage;
        const l = language === 'cn' ? 'zh' : language;
        this.props.changeLanguage(l);
        let location = '';
        if (lang === 'en') {
            location = this.props.history.location.pathname;
        } else {
            location = this.props.history.location.pathname.slice(l.length + 1);
        }
        this.props.history.push(buildPath(location, l));
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
    address: '',
    lang: selectCurrentLanguage(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    version: selectAppVersion(state),
    currentLanguage: selectCurrentLanguage(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    changeColorTheme: payload => dispatch(changeColorTheme(payload)),
    changeLanguage: payload => dispatch(changeLanguage(payload)),
    logout: () => dispatch(logoutFetch()),
    walletsReset: () => dispatch(walletsReset()),
    openGuardModal: () => dispatch(openGuardModal()),
});
// tslint:disable no-any
const NavBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarComponent) as any) as any;

export { NavBar };
