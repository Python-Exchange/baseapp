import {History} from 'history';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect, MapDispatchToPropsFunction, MapStateToProps} from 'react-redux';
import {Link, RouteProps, withRouter} from 'react-router-dom';
import { showLanding } from '../../../api';
// import { LogoutIcon } from '../../assets/images/LogoutIcon';
// import { Moon } from '../../assets/images/Moon';
// import { Sun } from '../../assets/images/Sun';
import {
    AEDIcon,
    CheckIcon,
    CNYIcon,
    //TODO: return after DownloadIcon,
    EURIcon,
    LeftMenuIcon,
    NotLoginIcon,
    OpenUserMenu,
    RightMenuIcon,
    RUBIcon,
    USDIcon,
    UserIcon,
} from '../../../assets/images/NavBarIcons';
import { GoogleTranslate } from '../../../components/GoogleTranslate';
import {coinOption, earnOption, ordersOption, tradeOption, userOption} from '../../../constants';
import {
    changeColorTheme,
    changeLanguage,
    getBalanceFetch,
    logoutFetch,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectUserInfo,
    User,
    walletsReset,
} from '../../../modules';
import {buildPath} from '../../helpers';

const logo = require('../../../assets/images/logo.svg');

export interface ReduxProps {
    colorTheme: string;
    address: string;
    lang: string;
    success?: boolean;
    user: User;
    currentLanguage: string;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
    changeLanguage: typeof changeLanguage;
    logout: typeof logoutFetch;
    walletsReset: typeof walletsReset;
    getBalanceFetch: typeof getBalanceFetch;
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}

type NavbarProps = OwnProps & ReduxProps & RouteProps & DispatchProps;

interface NavbarState {
    isOpen: boolean;
    isOpenLanguage: boolean;
    openMenuType: string;
    openMobileMenu: string;
    email: string;
    message: string;
    name: string;
    recaptchaResponse: string;
    // tslint:disable-next-line:no-any
    isLogin: any;
    errorModal: boolean;
}

// tslint:disable:jsx-no-lambda
class NavBarComponent extends React.Component<NavbarProps, NavbarState> {
    public readonly state = {
        isOpen: false,
        isOpenLanguage: false,
        openMenuType: '',
        openMobileMenu: '',
        email: '',
        name: '',
        message: '',
        recaptchaResponse: '',
        isLogin: null,
        errorModal: false,
    };
    private dropdownMenu = React.createRef<HTMLUListElement>();
    private mobileDropdownMenu = React.createRef<HTMLDivElement>();
    private headerRef = React.createRef<HTMLDivElement>();
    public componentWillMount(): void {
        this.setState({isLogin: localStorage.getItem('uil') !== null});
    }

    public componentDidMount(): void {
        this.props.getBalanceFetch(['btc', 'usd']);
    }

    public componentDidUpdate(prevProps: Readonly<NavbarProps>, prevState: Readonly<NavbarState>): void {
        const isLogin = localStorage.getItem('uil') !== null;
        if (isLogin !== this.state.isLogin) {
            this.setState({isLogin: isLogin});
        }
    }

    private openDropdown = (type: string) => {
        const {openMenuType} = this.state;
        if (type) {
            if (type === 'assets') {
                this.props.getBalanceFetch(['btc', this.props.user.activeCurrency]);
            }
            if (type === openMenuType) {
                this.setState({openMenuType: ''}, () => {
                    document.removeEventListener('click', this.closeMenu);
                });
            } else {
                document.removeEventListener('click', this.closeMenu);
                this.setState({openMenuType: type}, () => {
                    document.addEventListener('click', this.closeMenu);
                });
            }
        } else {
            this.setState({openMenuType: ''}, () => {
                document.removeEventListener('click', this.closeMenu);
            });
        }
    };

    private closeMenu = event => {
        // tslint:disable
        if (this.dropdownMenu && this.dropdownMenu.current && !this.dropdownMenu.current.contains(event.target)) {
            this.setState({openMenuType: ''}, () => {
                document.removeEventListener('click', this.closeMenu);
            });
        }
    };

    private closeMobileMenu = event => {
        // tslint:disable
        if (this.mobileDropdownMenu && this.mobileDropdownMenu.current && !this.mobileDropdownMenu.current.contains(event.target)) {
            this.setState({openMobileMenu: ''}, () => {
                document.removeEventListener('click', this.closeMobileMenu);
            });
        }
    };

    private openMobileMenu = (type: string) => {
        const {openMobileMenu} = this.state;
        if (type) {
            if (type === 'assets') {
                this.props.getBalanceFetch(['btc', this.props.user.activeCurrency]);
            }
            if (type === openMobileMenu) {
                this.setState({openMobileMenu: ''}, () => {
                    document.removeEventListener('click', this.closeMobileMenu);
                });
            } else {
                document.removeEventListener('click', this.closeMobileMenu);
                this.setState({openMobileMenu: type}, () => {
                    document.addEventListener('click', this.closeMobileMenu);
                });
            }
        } else {
            this.setState({openMobileMenu: ''}, () => {
                document.removeEventListener('click', this.closeMobileMenu);
            });
        }
    };

    //tslint:disable
    public render() {
        const {
            // colorTheme,
            lang,
            currentLanguage,
            // location,
            user,
        } = this.props;
        const baseURL = window.document.location.origin;
        const {openMenuType, openMobileMenu, isLogin} = this.state;
        const isMobileWith = this.headerRef.current && this.headerRef.current.clientWidth < 800;

        return (
            <div ref={this.headerRef} className={'pg-navbar'}>
                <a href={currentLanguage === 'en' ? baseURL : `${baseURL}/${currentLanguage}`} className="pg-navbar__logo" onClick={e => this.redirectToLanding()}>
                    <span>
                        <img src={logo} className="pg-logo__img" alt="Logo" />
                    </span>
                </a>
                <ul className="pg-navbar__content">
                    <span className="pg-navbar__mobile-icon pg-navbar__left-icon" onClick={() => this.openMobileMenu('left')}>
                        <LeftMenuIcon />
                    </span>
                    { (!isMobileWith || openMobileMenu === 'left') && <div ref={this.mobileDropdownMenu} className={`pg-navbar__mobile-menu${openMobileMenu === 'left' ? ' pg-navbar__mobile-open' : ''} pg-navbar__mobile-menu_left`}>
                        <div className="item">
                            <a href={currentLanguage === 'en' ? `${baseURL}/markets` : `${baseURL}/${currentLanguage}/markets`}>
                                <FormattedMessage id={'page.body.trade.header.markets'} />
                            </a>
                        </div>
                        {this.renderBuyWithCard()}
                        {this.renderTrade()}
                        {this.renderEarn()}
                        <div className="item">
                            <a href="http://emiswap.emirex.com" className="blink_me" target="_blank" rel="noopener noreferrer">
                                <FormattedMessage id={'page.body.trade.header.EmiSwap.join.now'} />
                            </a>
                        </div>
                    </div>}
                </ul>
                <div className={"pg-navbar__right"}>
                    <span className="pg-navbar__mobile-icon pg-navbar__right-icon" onClick={() => this.openMobileMenu('right')}>
                        {isLogin ? <RightMenuIcon /> : <NotLoginIcon /> }
                    </span>
                    {(!isMobileWith || openMobileMenu === 'right') && <div ref={this.mobileDropdownMenu} className={`pg-navbar__mobile-menu${openMobileMenu === 'right' ? ' pg-navbar__mobile-open' : ''} pg-navbar__mobile-menu_right`}>
                        {isLogin
                            ? <React.Fragment>
                                {this.renderOrders()}
                                {this.renderAssets(user.balance, user.cryptoCurrency, user.activeCurrency)}
                                {this.renderUserBlock()}
                            </React.Fragment>
                            : <React.Fragment>
                                <div className="log-btn">
                                    <a href={`${baseURL}${currentLanguage === 'en' ? '' : "/" + currentLanguage}/signin`} onClick={() => this.openDropdown('')}>
                                        <FormattedMessage id={'page.header.navbar.signIn'} />
                                    </a>
                                </div>
                                <div className="log-btn sign-up">
                                    <a href={`${baseURL}${currentLanguage === 'en' ? '' : "/" + currentLanguage}/signup`} onClick={() => this.openDropdown('')}>
                                        <FormattedMessage id={'page.header.signUp'} />
                                    </a>
                                </div>
                            </React.Fragment>
                        }
                        {/*<div className="download">*/}
                        {/*    {openMobileMenu === 'right' ? <FormattedMessage id={'page.header.navbar.download_mobile'} /> : <FormattedMessage id={'page.header.navbar.download'} />}*/}
                        {/*    <span className="icon">*/}
                        {/*        <DownloadIcon />*/}
                        {/*    </span>*/}
                        {/*</div>*/}
                        <div className="dropdown-block language" onClick={() => this.openDropdown('language')}>
                            <div className={`desktop-switcher-button${openMenuType === 'language' ? ' active-menu' : ''}`} onClick={() => this.toggleLanguageMenu()}>
                                <div>
                                    <span className="current-language">{
                                        lang === 'zh' ? '中文简体' :
                                            lang === 'en' ? 'English' :
                                                lang === 'tr' ? 'Turkish' : 'Русский'}</span>
                                    <span className="slash">/</span>
                                    <span className="current-currency">
                                        {user.activeCurrency}
                                    </span>
                                </div>
                                <span className="icon">
                                    <OpenUserMenu/>
                                </span>
                            </div>
                            { openMenuType === 'language' && <ul ref={this.dropdownMenu} className={`dropdown-menu language-menu`}>
                                <div className="left">
                                    <div className="header"> <FormattedMessage id={'nav_language'} /></div>
                                    <ul>
                                        <li className={`${lang === 'en' ? 'active-menu' : ''}`} onClick={() => this.handleChangeLanguage('en')}>
                                            <FormattedMessage id={'page.header.language.en'}/>
                                            {lang === 'en' && <CheckIcon />}
                                        </li>
                                        <li className={`${lang === 'ru' ? 'active-menu' : ''}`} onClick={() => this.handleChangeLanguage('ru')}>
                                            <FormattedMessage id={'page.header.language.ru'}/>
                                            {lang === 'ru' && <CheckIcon />}
                                        </li>
                                        <li className={`${lang === 'zh' ? 'active-menu' : ''}`} onClick={() => this.handleChangeLanguage('zh')}>
                                            <FormattedMessage id={'page.header.language.zh'}/>
                                            {lang === 'zh' && <CheckIcon />}
                                        </li>
                                        <li className={`${lang === 'tr' ? 'active-menu' : ''} soon`} onClick={() => {}}>
                                            <span className="notranslate"><FormattedMessage id={'page.header.language.tr'}/></span>
                                            {lang === 'tr' && <CheckIcon />}
                                            <span className="soon">
                                                (<FormattedMessage id={'page.header.soon'}/>)
                                            </span>
                                        </li>
                                        <li className={`notranslate`}>
                                            <GoogleTranslate />
                                        </li>
                                    </ul>
                                </div>
                                <div className="right">
                                    <div className="header"> <FormattedMessage id={'nav_currency'} /></div>
                                    <ul className="currency-menu">
                                        <li className={`${user.activeCurrency.toLowerCase() === 'usd' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('usd')}>
                                            <span className="currency-line">
                                                <span className="icon">
                                                    <USDIcon/>
                                                </span>
                                                <FormattedMessage id={'page.header.currency.usd'}/>
                                            </span>
                                            {user.activeCurrency.toLowerCase() === 'usd' && <CheckIcon />}
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'eur' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('eur')}>
                                            <span className="currency-line">
                                                <span className="icon">
                                                    <EURIcon/>
                                                </span>
                                                <FormattedMessage id={'page.header.currency.eur'}/>
                                            </span>
                                            {user.activeCurrency.toLowerCase() === 'eur' && <CheckIcon />}
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'rub' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('rub')}>
                                            <span className="currency-line">
                                                <span className="icon">
                                                    <RUBIcon/>
                                                </span>
                                                <FormattedMessage id={'page.header.currency.rub'}/>
                                            </span>
                                            {user.activeCurrency.toLowerCase() === 'rub' && <CheckIcon />}
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'cny' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('cny')}>
                                            <span className="currency-line">
                                                <span className="icon">
                                                    <CNYIcon/>
                                                </span>
                                                <FormattedMessage id={'page.header.currency.cny'}/>
                                            </span>
                                            {user.activeCurrency.toLowerCase() === 'cny' && <CheckIcon />}
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'aed' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('aed')}>
                                            <span className="currency-line">
                                                <span className="icon">
                                                    <AEDIcon/>
                                                </span>
                                                <FormattedMessage id={'page.header.currency.aed'}/>
                                            </span>
                                            {user.activeCurrency.toLowerCase() === 'aed' && <CheckIcon />}
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'try' ? 'active-menu' : ''} soon`} onClick={() => {}}>
                                            <span className="currency-line">
                                                <span className="icon">
                                                    <AEDIcon/>
                                                </span>
                                                <FormattedMessage id={'page.header.currency.try'}/>
                                                <span className="soon">
                                                    (<FormattedMessage id={'page.header.soon'}/>)
                                                </span>
                                            </span>
                                            {user.activeCurrency.toLowerCase() === 'aed' && <CheckIcon />}
                                        </li>
                                    </ul>
                                </div>
                            </ul>}
                        </div>
                    </div>}
                </div>
            </div>
        );
    }

    private redirectToLanding = () => {
        const { currentLanguage } = this.props;
        const baseURL = window.document.location.origin;

        this.props.history.push(`${showLanding() ? '/' : currentLanguage === 'en' ? baseURL : `${baseURL}/${currentLanguage}`}`);
    };

    private switchCurrency = (type) => {
        this.props.getBalanceFetch(['btc', type]);
    };

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

    private renderBuyWithCard = () => {
        const options = coinOption();
        const {openMenuType, openMobileMenu} = this.state;
        const isMobileOpen = openMenuType === 'buyWithCard' && openMobileMenu === 'left';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : ''}`}>
            <div className={`desktop-switcher-button${openMenuType === 'buyWithCard' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('buyWithCard')}>
                <FormattedMessage id={'page.header.navbar.buy_credit_card'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'buyWithCard' && this.renderDropdownMenu(options, true, isMobileOpen, 'buyWithCard')}
        </div>);
    };

    private renderTrade = () => {
        const options = tradeOption();
        const {openMenuType, openMobileMenu} = this.state;
        const isMobileOpen = openMenuType === 'trade' && openMobileMenu === 'left';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : ''}`}>
            <div className={`desktop-switcher-button${openMenuType === 'trade' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('trade')}>
                <FormattedMessage id={'page.header.navbar.trade'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'trade' && this.renderDropdownMenu(options, false, isMobileOpen,  'trade')}
        </div>);
    };

    private renderEarn = () => {
        const options = earnOption();
        const {openMenuType, openMobileMenu} = this.state;
        const isMobileOpen = openMenuType === 'earn' && openMobileMenu === 'left';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : ''}`}>
            <div className={`desktop-switcher-button${openMenuType === 'earn' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('earn')}>
                <FormattedMessage id={'page.header.navbar.earn'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'earn' && this.renderDropdownMenu(options, false, isMobileOpen,  'earn')}
        </div>);
    };

    private renderDropdownMenu = (options, isMainSite, isMobileOpen, type) => {
        const path = window.document.location.origin;
        const { currentLanguage } = this.props;
        return (<ul ref={this.dropdownMenu} className={`dropdown-menu dropdown-menu__${type}`}>
            {options.map(option => (
                <li className={`${option.border ? 'border' : ''}`}>
                    {!option.logout
                        ? !option.soon
                            ? !isMainSite
                                ? !option.extLink
                                    ? <Link to={`${currentLanguage === 'en' ? '' : `/${currentLanguage}`}${option.href}`} onClick={() => isMobileOpen ? this.openMobileMenu('') : this.openDropdown('')}>
                                          {option.label && <div className="label">
                                              <FormattedMessage id={option.label}/>
                                          </div>}
                                          {option.description && <div className="description">
                                              <FormattedMessage id={option.description}/>
                                          </div>}
                                      </Link>
                                    : <a href={option.mainsite ? `${path}${currentLanguage === 'en' ? '' : "/" + currentLanguage}${option.href}` : option.href} onClick={() => isMobileOpen ? this.openMobileMenu('') : this.openDropdown('')} target={option.newTab ? '_blank' : ''}>
                                        {option.label && <div className="label">
                                            <FormattedMessage id={option.label}/>
                                        </div>}
                                        {option.description && <div className="description">
                                            <FormattedMessage id={option.description}/>
                                        </div>}
                                    </a>
                                : <a href={`${path}${currentLanguage === 'en' ? '' : `/${currentLanguage}`}${option.href}`} onClick={() => isMobileOpen ? this.openMobileMenu('') : this.openDropdown('')}>
                                    {option.label && <div className="label">
                                        <FormattedMessage id={option.label}/>
                                    </div>}
                                    {option.description && <div className="description">
                                        <FormattedMessage id={option.description}/>
                                    </div>}
                                </a>
                            : <div>
                                {option.label && <div className="label">
                                    <FormattedMessage id={option.label}/>
                                    <span className="soon">
                                        (<FormattedMessage id={'page.header.soon'}/>)
                                    </span>
                                </div>}
                                {option.description && <div className="description">
                                    <FormattedMessage id={option.description}/>
                                </div>}
                            </div>
                        :  <div className="label" onClick={() => this.handleLogOut()}>
                                <FormattedMessage id={option.label}/>
                        </div>}
                </li>
            ))}
        </ul>);
    };

    private renderUserBlock = () => {
        const options = userOption();
        const { isLogin } = this.state;
        const { openMenuType, openMobileMenu } = this.state;
        const isMobileOpen = openMobileMenu === 'right';
        return (<div className="dropdown-block user">
            <div className={`desktop-switcher-button${openMenuType === 'orders' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('user')}>
                {<span className="icon">
                    {isLogin ? <UserIcon /> : <NotLoginIcon /> }
                </span> }
            </div>
            {(openMenuType === 'user' || isMobileOpen) && this.renderDropdownMenu(options, false, isMobileOpen,  'user')}

        </div>)
    };
    private renderOrders = () => {
        const options = ordersOption();
        const { openMenuType, openMobileMenu } = this.state;
        const isMobileOpen = openMenuType === 'orders' && openMobileMenu === 'right';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : ''} orders`}>
            <div className={`desktop-switcher-button${openMenuType === 'orders' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('orders')}>
                <FormattedMessage id={'page.header.orders'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'orders' && this.renderDropdownMenu(options, false, isMobileOpen,  'orders')}

        </div>)
    };
    private renderAssets = (balance, crypto, currency) => {
        const { openMenuType, openMobileMenu } = this.state;
        const { currentLanguage } = this.props;
        const isMobileOpen = openMenuType === 'assets' && openMobileMenu === 'right';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : '' } assets`}>
            <div className={`desktop-switcher-button${openMenuType === 'assets' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('assets')}>
                <FormattedMessage id={'page.header.assets'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'assets' && <ul ref={this.dropdownMenu} className={`dropdown-menu assets-menu`}>
                <li className="assets">
                    <div className="header">
                        <FormattedMessage id={'page.header.current_balance'}/>
                    </div>
                    <Link to={`${currentLanguage === 'en' ? '' : `/${currentLanguage}`}/wallets`} className="balance" onClick={() => this.openDropdown('')}>
                        <div className="currency-group">
                            <span className="currency left-cur">{balance[crypto.toUpperCase()].toFixed(2)}</span>
                            <span className="type-currency">{crypto.toUpperCase()}</span>
                        </div>
                        <span className="sym">≈</span>
                        <div className="currency-group">
                            <span className="currency right-cur">{balance[currency.toUpperCase()].toFixed(2)}</span>
                            <span className="type-currency">{currency.toUpperCase()}</span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={`${currentLanguage === 'en' ? '' : `/${currentLanguage}`}/wallets`} onClick={() => this.openDropdown('')}>
                        <FormattedMessage id={'page.header.deposit_withdraw'}/>
                    </Link>
                </li>
                <li>
                    <a href={`${currentLanguage === 'en' ? '' : `/${currentLanguage}`}/history/deposits`} onClick={() => this.openDropdown('')}>
                        <FormattedMessage id={'page.body.history.deposit'}/>
                    </a>
                </li>
                <li>
                    <a href={`${currentLanguage === 'en' ? '' : `/${currentLanguage}`}/history/withdraws`} onClick={() => this.openDropdown('')}>
                        <FormattedMessage id={'page.body.history.withdraw'}/>
                    </a>
                </li>
                <li>
                    <a href={`${currentLanguage === 'en' ? '' : `/${currentLanguage}`}/buycrypto`} onClick={() => this.openDropdown('')}>
                        <FormattedMessage id={'page.header.buy_crypto'}/>
                    </a>
                </li>
                {/*<li>*/}
                {/*    <Link to={'/buycrypto'} onClick={() => this.openDropdown('')}>*/}
                {/*        <FormattedMessage id={'page.header.buy_crypto'}/>*/}
                {/*    </Link>*/}
                {/*</li>*/}
            </ul>}

        </div>)
    };


    // private handleChangeCurrentStyleMode = (value: string) => {
    //     if (this.props.version === 'Lite') {
    //         this.props.openGuardModal();
    //     } else {
    //         this.props.changeColorTheme(value);
    //     }
    // };

    // private handleRouteChange = (to: string) => () => {
    //     this.setState({isOpen: false}, () => {
    //         this.props.history.push(to);
    //     });
    // };
    //
    private handleLogOut = () => {
        localStorage.removeItem('uil');
        localStorage.removeItem('refCode');
        localStorage.removeItem('usedCoins');
        this.openMobileMenu('');
        this.openDropdown('');
            this.setState(
            {
                isOpen: false,
            },
            () => {
                this.props.logout();
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
    address: '',
    lang: selectCurrentLanguage(state),
    currentLanguage: selectCurrentLanguage(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    changeColorTheme: payload => dispatch(changeColorTheme(payload)),
    changeLanguage: payload => dispatch(changeLanguage(payload)),
    getBalanceFetch: payload => dispatch(getBalanceFetch(payload)),
    logout: () => dispatch(logoutFetch()),
    walletsReset: () => dispatch(walletsReset()),
});
// tslint:disable no-any
const NavBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarComponent) as any) as any;

export {NavBar};