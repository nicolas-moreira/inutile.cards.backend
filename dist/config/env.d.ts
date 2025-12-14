export declare const config: {
    readonly server: {
        readonly port: number;
        readonly host: string;
        readonly nodeEnv: string;
    };
    readonly mongodb: {
        readonly uri: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly expiresIn: string;
    };
    readonly cors: {
        readonly frontendUrl: string;
    };
    readonly email: {
        readonly smtpHost: string;
        readonly smtpPort: number;
        readonly smtpUser: string;
        readonly smtpPass: string;
        readonly from: string;
    };
};
//# sourceMappingURL=env.d.ts.map