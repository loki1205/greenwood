const fs = require('fs');
const path = require('path');
const url = require('url');

let defaultConfig = {
  workspace: path.join(process.cwd(), 'src'),
  devServer: {
    port: 1984,
    host: 'localhost'
  },
  publicPath: '/',
  title: 'Greenwood App',
  meta: [],
  plugins: [],
  themeFile: 'theme.css'
};

module.exports = readAndMergeConfig = async() => {
  // eslint-disable-next-line complexity
  return new Promise((resolve, reject) => {
    try {
      // deep clone of default config
      let customConfig = JSON.parse(JSON.stringify(defaultConfig));
      
      if (fs.existsSync(path.join(process.cwd(), 'greenwood.config.js'))) {
        const userCfgFile = require(path.join(process.cwd(), 'greenwood.config.js'));        
        const { workspace, devServer, publicPath, title, meta, plugins, themeFile } = userCfgFile;
          
        // workspace validation
        if (workspace) {
          if (typeof workspace !== 'string') {
            reject('Error: greenwood.config.js workspace path must be a string');
          }

          if (!path.isAbsolute(workspace)) {
            // prepend relative path with current directory
            customConfig.workspace = path.join(process.cwd(), workspace);
          }

          if (path.isAbsolute(workspace)) {
            // use the users provided path
            customConfig.workspace = workspace;
          }

          if (!fs.existsSync(customConfig.workspace)) {
            reject('Error: greenwood.config.js workspace doesn\'t exist! \n' +
              'common issues to check might be: \n' + 
              '- typo in your workspace directory name, or in greenwood.config.js \n' +
              '- if using relative paths, make sure your workspace is in the same cwd as _greenwood.config.js_ \n' +
              '- consider using an absolute path, e.g. path.join(__dirname, \'my\', \'custom\', \'path\') // <__dirname>/my/custom/path/ ');
          }
        }

        if (title) {
          if (typeof title !== 'string') {
            reject('Error: greenwood.config.js title must be a string');
          }
          customConfig.title = title;
        }

        if (publicPath) {
          if (typeof publicPath !== 'string') {
            reject('Error: greenwood.config.js publicPath must be a string');
          } else {
            customConfig.publicPath = publicPath;
            // console.log('custom publicPath provided => ', customConfig.publicPath);
          }
        }

        if (meta && meta.length > 0) {
          customConfig.meta = meta;
        }

        if (plugins && plugins.length > 0) {
          const types = ['index', 'webpack'];

          plugins.forEach(plugin => {
            if (!plugin.type || types.indexOf(plugin.type) < 0) {
              reject(`Error: greenwood.config.js plugins must be one of type "${types.join(', ')}". got "${plugin.type}" instead.`);
            }

            if (!plugin.provider || typeof plugin.provider !== 'function') {
              const providerTypeof = typeof plugin.provider;

              reject(`Error: greenwood.config.js plugins provider must of type function. got ${providerTypeof} instead.`);
            }
          });

          customConfig.plugins = plugins;
        }

        if (themeFile) {
          if (typeof themeFile !== 'string' && themeFile.indexOf('.') < 1) {
            reject(`Error: greenwood.config.js themeFile must be a valid filename. got ${themeFile} instead.`);
          }
          customConfig.themeFile = themeFile;
        }

        if (devServer && Object.keys(devServer).length > 0) {
          
          if (devServer.host) {
            // eslint-disable-next-line max-depth
            if (url.parse(devServer.host).pathname === null) {
              reject(`Error: greenwood.config.js devServer host type must be a valid pathname.  Passed value was: ${devServer.host}`);
            } else {
              customConfig.devServer.host = devServer.host;
              // console.log(`custom host provided => ${customConfig.devServer.host}`);
            }
          }

          if (devServer.port) {
            // eslint-disable-next-line max-depth
            if (!Number.isInteger(devServer.port)) {
              reject(`Error: greenwood.config.js devServer port must be an integer.  Passed value was: ${devServer.port}`);
            } else {
              customConfig.devServer.port = devServer.port;
              // console.log(`custom port provided => ${customConfig.devServer.port}`);
            }
          }

        }
      }

      resolve({ ...defaultConfig, ...customConfig });
    } catch (err) {
      reject(err);
    }
  });
};