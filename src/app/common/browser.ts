import { isFunction, size, slice } from "lodash-es";

export class Browser {
    static enableWorker: boolean = true;
    static enableWasm: boolean = true;
    static mobileDevice?: boolean;
    static userAgent = navigator?.userAgent || navigator.vendor || "";

    static isOpera(): boolean {
        return (!!(<any>window).opr && !!(<any>window).opr.addons) || !!(<any>window).opera || Browser.userAgent?.indexOf(" OPR/") >= 0;
    }

    static isFireFox(): boolean {
        let userAgent = this.getUserAgent();
        return (typeof (<any>window).InstallTrigger !== "undefined") || /Firefox/i.test(userAgent) || /FxiOS/i.test(userAgent);
    }

    static isSafari(): boolean {
        if (Browser.isChrome() || Browser.isFireFox() || Browser.isEdge() || Browser.isSamsung() || Browser.isWhale()) {
            return false;
        }

        let userAgent = Browser.userAgent;
        return /Safari/i.test(userAgent)
            || Browser.checkSafari(window["safari"] ? (<any>window).safari.pushNotification : "");
    }

    static isSafari11(): boolean {
        return Browser.isSafari() && Browser.getVersion() == "11";
    }

    private static checkSafari(pushNotification) {
        return pushNotification.toString() === "[object SafariRemoteNotification]";
    }

    static isInternetExplorer(): boolean {
        return /*@cc_on!@*/false || !!(<any>window).document?.documentMode;
    }

    static isEdge(): boolean {
        const userAgent = this.getUserAgent();
        return (!Browser.isInternetExplorer() && !!(<any>window).StyleMedia) || /Edge/i.test(userAgent) || /EdgiOS/i.test(userAgent) || /EdgA/i.test(userAgent);
    }

    static isSamsung(): boolean {
        return this.getUserAgent().indexOf("SamsungBrowser") !== -1;
    }

    static isWhale(): boolean {
        return this.getUserAgent().indexOf("Whale") !== -1;
    }

    // note: chromium is browser engine. samsung browser and naver whale are using chromium engine
    static isChromium(): boolean {
        const brands = (<any>window)?.navigator?.userAgentData?.brands ?? [];
        return brands.find(brand => brand.brand == "Chromium") !== undefined;
    }

    static isChrome(): boolean {
        let winNav = (<any>window).navigator;
        return (!!(<any>window).chrome && winNav.vendor === "Google Inc." && !Browser.isOpera() && !Browser.isEdge())
            || (Browser.isIos() && Browser.userAgent?.indexOf("CriOS") !== -1);
    }

    static isBlink(): boolean {
        return (Browser.isChrome() || Browser.isOpera()) && !!(<any>window).CSS;
    }

    static isIosMobileWebView(): boolean {
        let isStandalone = (<any>window)?.navigator?.standalone ?? false;
        return Browser.isIos() && !isStandalone && !Browser.isSafari() && !Browser.isChrome();
    }

    static isAndroidMobileWebView(): boolean {
        return Browser.isAndroid() && !!(<any>window).Android;
    }

    static isMobileWebView(): boolean {
        return Browser.isIosMobileWebView() || Browser.isAndroidMobileWebView();
    }

    static isFacebookMobileBrowser(): boolean {
        return (this.getUserAgent().indexOf("FBAN") > -1) || (this.getUserAgent().indexOf("FBAV") > -1);
    }

    static isInstagramMobileBrowser(): boolean {
        return (this.getUserAgent().indexOf("Instagram") > -1);
    }

    static isTwitterMobileBrowser(): boolean {
        return (this.getUserAgent().indexOf("Twitter") > -1);
    }

    static isIos(): boolean {
        let userAgent = Browser.userAgent;
        return /iPhone/i.test(userAgent)
            || /iPad/i.test(userAgent)
            || /iPod/i.test(userAgent)
            || this.isIpad();
    }

    static isChromeOs(): boolean {
        let userAgent = Browser.userAgent;
        return /CrOS/i.test(userAgent);
    }

    // considered as an industry bad practice, use viewport detection instead
    static isMobileViewUsingIncorrectHackForDetectingResponsiveMode(): boolean {
        return Browser.isMobile() && !Browser.isIpad();
    }

    static isMobile(): boolean {
        if (typeof Browser.mobileDevice !== "undefined") {
            return Browser.mobileDevice;
        }

        let userAgent = Browser.userAgent;

        Browser.mobileDevice = /Android/i.test(userAgent)
            || /webOS/i.test(userAgent)
            || /iPhone/i.test(userAgent)
            || /iPad/i.test(userAgent)
            || /iPod/i.test(userAgent)
            || /BlackBerry/i.test(userAgent)
            || /Windows Phone/i.test(userAgent)
            || Browser.isIpad();

        return Browser.mobileDevice;
    }

    static getDevice(): string {
        let userAgent = Browser.userAgent;
        return /Android/i.test(userAgent) ? "Android"
            : /webOS/i.test(userAgent) ? "webOS"
                : /iPhone/i.test(userAgent) ? "iPhone"
                    : /iPad/i.test(userAgent) ? "iPad"
                        : /iPod/i.test(userAgent) ? "iPod"
                            : /BlackBerry/i.test(userAgent) ? "BlackBerry"
                                : /Windows Phone/i.test(userAgent) ? "Windows Phone"
                                    : "Desktop";
    }

    static isIpad(): boolean {
        return isIpad(Browser.userAgent)
            || (/MacIntel/.test(navigator.platform) && navigator?.maxTouchPoints > 2);
    }

    static isIosDesktopView(): boolean {
        const iOSPlatformMatch = !!(navigator.platform && navigator.platform.match(/iPhone|iPod|iPad/));
        return iOSPlatformMatch || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    }

    static getVersion(): string {
        let userAgent = Browser.userAgent;
        let pieces = [];
        if (Browser.isInternetExplorer()) {
            pieces = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
            return pieces ? pieces[1] || "" : "";
        }
        if (Browser.isOpera()) {
            pieces = userAgent.match(/opera\/?\s*(\d+)/i);
            return pieces ? pieces[1] || "" : "";
        }

        if (Browser.isIos() || Browser.isSafari()) {
            pieces = userAgent.match(/(version|safari(?=\/))\/?\s*(\d+)/i);
        } else if (Browser.isChrome()) {
            pieces = userAgent.match(/(chrome(?=\/))\/?\s*(\d+)/i);
        } else if (Browser.isFireFox()) {
            pieces = userAgent.match(/(firefox(?=\/))\/?\s*(\d+)/i);
        } else if (Browser.isEdge()) {
            pieces = userAgent.match(/(trident|edge(?=\/))\/?\s*(\d+)/i);
        }

        return pieces ? pieces[2] || "" : "";
    }

    static getName(): string {
        if (Browser.isChrome()) {
            return "Chrome";
        }
        if (Browser.isFireFox()) {
            return "FireFox";
        }
        if (Browser.isSafari()) {
            return "Safari";
        }
        if (Browser.isEdge()) {
            return "Edge";
        }
        if (Browser.isInternetExplorer()) {
            return "IE";
        }
        if (Browser.isOpera()) {
            return "Opera";
        }

        return "";
    }

    static isAndroid(): boolean {
        let userAgent = Browser.userAgent;
        return /Android/i.test(userAgent);
    }

    static inIframe(): boolean {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    static appendScript(id: string, url: string, async: boolean = true, onloadFn?: (any) => any, onerrorFn?: (any) => any, defer: boolean = false): void {
        if (document.getElementById(id)) {
            return;
        }
        let js = document.createElement("script");
        js.id = id;
        js.src = url;
        js.async = async;
        if (defer) {
            js.defer = true;
        }
        if (onloadFn && isFunction(onloadFn)) {
            js.onload = onloadFn;
        }
        if (onerrorFn && isFunction(onerrorFn)) {
            js.onerror = onerrorFn;
        }
        let scriptElement = document.getElementsByTagName("script")[0];
        scriptElement.parentNode.insertBefore(js, scriptElement);
    }

    static appendMeta(name: string, content: string): void {
        let meta = document.createElement("meta");
        meta.setAttribute("name", name);
        meta.setAttribute("content", content);
        let head = slice(document.getElementsByName("head"));
        if (!size(head)) {
            return;
        }
        head[0].appendChild(meta);
    }

    static appendStyle(id: string, url: string): void {
        if (!id || document.getElementById(id)) {
            return;
        }

        const head = document.getElementsByTagName("head")[0];
        if (!head) {
            return;
        }
        let link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        link.media = "all";
        head.appendChild(link);
    }

    static removeStyle(id: string): void {
        const styleEl = document.getElementById(id);
        const head = document.getElementsByTagName("head")[0];
        if (!head || !document.getElementById(id)) {
            return;
        }
        head.removeChild(styleEl);
    }

    static getIosVersion(): string {
        if (!Browser.isMobile() || !Browser.isIos()) {
            return "";
        }
        return getIosVersion(Browser.userAgent);
    }

    static getAndroidVersion(): string {
        if (!Browser.isMobile() || !Browser.isAndroid()) {
            return "";
        }

        let userAgent = Browser.userAgent;
        let match = userAgent.match(/android\s([0-9\.]*)/i);
        return match ? match[1] : undefined;
    }

    static getUserAgent(): string {
        return Browser.userAgent || "";
    }

    static isAudioWorkletEnabled(): boolean {
        if (!(<any>window).OfflineAudioContext) {
            return false;
        }
        let context = new OfflineAudioContext(1, 1, 44100);
        return Boolean(
            (<any>context).audioWorklet &&
            typeof (<any>context).audioWorklet.addModule === "function"
        );
    }

    static getOSVersion(): string {
        switch (Browser.getOSName()) {
            case "Android": {
                const splitUserAgent = Browser.userAgent.split("Android ");
                if (splitUserAgent.length > 1) {
                    return splitUserAgent[1].split(";")[0];
                }
            }
                break;
            case "Windows": {
                const splitUserAgent = Browser.userAgent.split("Windows NT ");
                if (splitUserAgent.length > 1) {
                    const versionSubStr = splitUserAgent[1];

                    if (versionSubStr.startsWith("5.0")) {
                        return "2000";
                    } else if (versionSubStr.startsWith("5.1")) {
                        return "XP";
                    } else if (versionSubStr.startsWith("5.2")) {
                        return "Server";
                    } else if (versionSubStr.startsWith("6.0")) {
                        return "Vista";
                    } else if (versionSubStr.startsWith("6.1")) {
                        return "7";
                    } else if (versionSubStr.startsWith("6.2")) {
                        return "8";
                    } else if (versionSubStr.startsWith("6.3")) {
                        return "8.1";
                    } else if (versionSubStr.startsWith("10.0")) {
                        return "10";
                    }
                }
            }
                break;
            case "iOS": {
                const osStr = "OS ";
                const splitUserAgent = Browser.userAgent.split("OS ");
                if (splitUserAgent.length > 1) {
                    const unformattedVersion = splitUserAgent[1].split(" ")[0];
                    return unformattedVersion.split("_").join(".");
                }
            }
                break;
            case "MacOS": {
                const splitUserAgent = Browser.userAgent.split("Mac OS X ");
                if (splitUserAgent.length > 1) {
                    let endOfVersion = splitUserAgent[1].indexOf(";");
                    const firstParantheses = splitUserAgent[1].indexOf(")");
                    if (firstParantheses > -1 && (firstParantheses < endOfVersion || endOfVersion == -1)) {
                        endOfVersion = firstParantheses;
                    }

                    const unformattedVersion = splitUserAgent[1].substring(0, endOfVersion);
                    return unformattedVersion.split("_").join(".");
                }
            }
                break;
        }
        return "";
    }

    static getOSName(): string {
        let platform = navigator.platform;
        if (platform.indexOf("Win") != -1) {
            return "Windows";
        }

        if (platform.indexOf("iPhone") != -1) {
            return "iOS";
        }

        if (platform.indexOf("Mac") != -1) {
            return "MacOS";
        }

        if (platform.indexOf("Android") != -1) {
            return "Android";
        }

        if (platform.indexOf("X11") != -1 || platform.indexOf("Linux") != -1) {
            return "UNIX";
        }

        return "Unknown OS";
    }

    static isMac(): boolean {
        return navigator.appVersion.indexOf("Mac") != -1;
    }

    static isLinux(): boolean {
        return navigator.appVersion.indexOf("Linux") != -1;
    }

    static isUnix(): boolean {
        return navigator.appVersion.indexOf("X11") != -1;
    }

    static isWindows(): boolean {
        return navigator.appVersion.indexOf("Win") != -1;
    }

    static isWorkerEnabled(): boolean {
        if (!Browser.enableWorker) {
            return false;
        }

        return typeof (<any>window).Worker !== "undefined";
    }

    static setWorkerEnabledFlag(flag: boolean): void {
        Browser.enableWorker = flag;
    }

    static isWebAssemblyEnabled(): boolean {
        if (!Browser.enableWasm) {
            return false;
        }
        const webAssembly = (<any>window).WebAssembly;
        return typeof webAssembly === "object" && typeof webAssembly.Memory === "function";
    }

    static setWebAssemblyEnabledFlag(flag: boolean): void {
        Browser.enableWasm = flag;
    }

    static isExtendedLocalStorageMemorySafe(): boolean {
        return !Browser.isMobile() && !Browser.isChromeOs() && (Browser.isFireFox() || Browser.isChrome());
    }

    static getBrowserLanguage(): string {
        const lang = (<any>window)?.navigator?.language ?? "";
        return lang.split(/-|_/)[0];
    }

    static parseJwt(token: string): any {
        if (!token) {
            return [];
        }
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(atob(base64).split("").map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
        return JSON.parse(jsonPayload);
    }
}

export const isIos = (userAgent: string): boolean => {
    return /iPhone/i.test(userAgent)
        || /iPad/i.test(userAgent)
        || /iPod/i.test(userAgent)
        || isIpad(userAgent);
};

export const getIosVersion = (userAgent: string): string | undefined => {
    let start = userAgent?.indexOf("iOS ");
    if (start < 0) {
        start = userAgent?.indexOf("OS ");
    }
    const FROM = 3;
    const LENGTH = 3;
    if (start > -1) {
        return userAgent?.substr(start + FROM, LENGTH).replace("_", ".");
    }
    return undefined;
};

export const isIpad = (userAgent: string): boolean => {
    return /iPad/i.test(userAgent);
};


