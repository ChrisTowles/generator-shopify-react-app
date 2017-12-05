var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('appname', { type: String, required: false });
        this.argument('shopifyApiKey', { type: String, required: false });
        this.argument('graphqlApiUrl', { type: String, required: false });
    }

    prompting() {
        const prompts = [];
        if (!this.options.appname) {
            prompts.push({
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname // Default to current folder name
            });
        }
        if (!this.options.shopifyApiKey) {
            prompts.push({
                type: 'input',
                name: 'shopifyApiKey',
                message: 'Your Shopify API Key',
            });
        }
        if (!this.options.graphqlApiUrl) {
            prompts.push({
                type: 'input',
                name: 'graphqlApiUrl',
                message: 'Your GraphQL API endpoint',
            });
        }
        return this.prompt(prompts)
            .then((answers) => {
                if (answers.appname) { this.options.appname = answers.appname }
                if (answers.shopifyApiKey) { this.options.shopifyApiKey = answers.shopifyApiKey }
                if (answers.graphqlApiUrl) { this.options.graphqlApiUrl = answers.graphqlApiUrl }
            });
    }

    writing() {
        const templateFiles = [
            "LICENSE",
            "package.json",
            "package-lock.json",
            "README.md",
            "schema.json",
            "tsconfig.json",
            "tslint.json",
            "jest/enzyme.js",
            "src/index.tsx",
            "src/schema.ts",
            "src/styles.global.scss",
            "src/components/Callback.scss",
            "src/components/Callback.tsx",
            "src/components/CheckAuth.tsx",
            "src/components/Login.scss",
            "src/components/Login.tsx",
            "src/components/Spinner.scss",
            "src/components/Spinner.tsx",
            "src/components/UnexpectedError.tsx",
            "src/components/__tests__/Callback.tsx",
            "src/components/__tests__/CheckAuth.tsx",
            "src/components/__tests__/Login.tsx",
            "src/components/__tests__/__snapshots__/Callback.tsx.snap",
            "src/components/__tests__/__snapshots__/CheckAuth.tsx.snap",
            "src/components/__tests__/__snapshots__/Login.tsx.snap",
            "src/containers/CallbackContainer.tsx",
            "src/containers/EmbeddedAppContainer.tsx",
            "src/containers/UnexpectedErrorContainer.tsx",
            "src/containers/HomeContainer.tsx",
            "src/containers/LoginContainer.tsx",
            "src/containers/LogoutContainer.tsx",
            "src/containers/NotFoundContainer.tsx",
            "src/graphql/index.d.ts",
            "src/graphql/ShopifyAuthBeginMutation.graphql",
            "src/graphql/ShopifyAuthCompleteMutation.graphql",
            "src/lib/query-string.ts",
            "src/lib/__tests__/query-string.ts",
            "src/routes/App.tsx",
            "webpack/common.config.js",
            "webpack/dev.config.js",
            "webpack/prod.config.js",
        ];
        const otherFiles = [
            "src/favicon.png",
            "src/index.ejs",
            "dist/.gitkeep",
            "static/css/.gitkeep",
            "static/img/.gitkeep",
            "static/js/.gitkeep"
        ];
        const params = {
            "appname": this.options.appname || this.appname,
            "graphqlApiUrl": this.options.graphqlApiUrl || this.graphqlApiUrl,
            "shopifyApiKey": this.options.shopifyApiKey || this.shopifyApiKey,
        }

        for (const f of templateFiles) {
            this.fs.copyTpl(
                this.templatePath(f),
                this.destinationPath(f),
                params
            );
        }

        for (const f of otherFiles) {
            this.fs.copy(
                this.templatePath(f),
                this.destinationPath(f)
            );
        }

        this.fs.copy(
            this.templatePath("gitignore"),
            this.destinationPath(".gitignore")
        );
    }
};
