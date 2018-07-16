const rewireMobX = require('react-app-rewire-mobx');
const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');


/* config-overrides.js */
module.exports = function override(config, env) {
    config = rewireMobX(config, env);
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    // config = rewireLess.withLoaderOptions({
    //     modifyVars: { "@primary-color": "#1DA57A" }
    // })(config, env);
    config=rewireLess(config,env);
    return config;
};