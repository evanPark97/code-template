declare namespace NodeJS {
    interface Process {
        env: ProcessEnv;
    }
    interface ProcessEnv {
        NODE_ENV: string;
        
        // infura api key
        PROJECT_ID: string;
        PROJECT_SECRET: string;

        // network provider
        MAINNET_HTTP: string;
        MAINNET_WSS: string;
        TESTNET_HTTP: string;
        TESTNET_WSS: string;

        // account
        ACCOUNT_PUBLIC_KEY: string;
        ACCOUNT_PRIVATE_KEY: string;

        // transfer setting
        MINIMUM_BALANCE: string;

        // database
        DB_HOST: string;
        DB_DATABASE: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;

        // status
        PENDING: string;
        SUCCESS: string;
        FAIL: string;
    }
}