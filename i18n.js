var fs = require('fs'),
    unicode = require('./unicode.js');
/**
 *
 * i18n
 *
 * pathMap is a map with the translation keys and path like:
 * {
 *   bundleKey : [full file path to the message bundle resources],
 *   anotherBundleKey : [full file path to the message bundle resources]
 * }
 *
 * Read translations from messages.properties files and save them as a json object
 * it replaces all occurences of 'text.<key>' in the jade templates with the translations
 * the format of the json is:
 * {
 *   bundleKey : {
 *      fallback : {map of default keys},
 *      de : {map of all de keys},
 *      ... : {map of on so on keys}
 *   },
 *   anotherBundleKey : [full file path to the message bundle resources]
 * }
 *
 * @param pathMap
 * @param conf {jsf: true|false}
 * @param cb - called if all bundles are loaded
 */
function i18n(pathMap, conf, cb){
    var returnObj = {},
        numberOfBundles = Object.keys(pathMap).length;

    function fillMissingTranslationsWithFallbacks() {

        // do it for every translation bundle
        Object.keys(returnObj).forEach(function(keyBundle) {
            var translationBundle = returnObj[keyBundle];
            var translationsFallback = translationBundle.dev['fallback'];

            // do it for every language in the bundle
            Object.keys(translationBundle).forEach(function(keyLanguage) {
                var translations = translationBundle[keyLanguage];
                if(keyLanguage === 'fallback') {
                    return;
                }

                // fill up missing keys
                Object.keys(translationsFallback).forEach(function(keyText) {
                    if(!translations.hasOwnProperty(keyText)) {
                        translations[keyText] = translationsFallback[keyText];
                    }
                });
            });
        });
    }

    function handleCallback() {
        numberOfBundles--;
        if (numberOfBundles <= 0) {
            fillMissingTranslationsWithFallbacks();
            cb(returnObj);
        }
    }

    Object.keys(pathMap).forEach(function (key) {

        // create empty object with the actual key
        returnObj[key] = {};
         // the self executed function is only because it was before a async callback and it was easier to refactor to sync (because of gulp :/)
        fs.exists(pathMap[key], function (exists) {
            if (exists) {
                // read files from dir that contains message bundles
                fs.readdir(pathMap[key], function (err, files) {
                    if (err === null) {
                        returnObj[key] = parsePropertiesFiles(files);
                    } else {
                        console.log('gulpfile:readdir has problem to read', pathMap[key]);
                    }
                    handleCallback();
                });

                // reads translations from a list of file names and returns them as a json object
                function parsePropertiesFiles(fileNames) {
                    // this holds all the translations
                    var asJson = {
                        dev : {},
                        jsf : {}
                    };
                    // parse every .properties file
                    fileNames.forEach(function(path) {
                        var pathAbsolute = pathMap[key] + '/' + path;
                        // skip directories
                        if(!fs.statSync(pathAbsolute).isDirectory()) {
                            // get language
                            var lang = path.indexOf('_') !== -1 ? path.substring(path.indexOf('_') + 1, path.indexOf('.')) : 'fallback',
                                // parse .properties file
                                data = fs.readFileSync(pathAbsolute, { encoding: 'UTF8' }),
                                bundle = convertPropertiesToJson(data);
                            asJson.jsf[lang] = bundle.jsf;
                            asJson.dev[lang] = bundle.dev;
                        }
                    });
                    return asJson;
                }

                // takes the content of a properties file and returns it as json
                function convertPropertiesToJson(data) {
                    var asJson = {
                        dev : {},
                        jsf : {}
                    };
                    // parse every line and store key-value-pairs as json
                    data.split('\n').forEach(function(line) {
                        var splitted;
                        // skip comments and empty strings
                        if (line.indexOf('#') === -1 && line.length > 2) {
                            splitted = line.split('=');
                            // JSF
                            asJson.jsf[splitted[0]] = '#{' + key + '.' + splitted[0] + '}';
                            // prototype
                            asJson.dev[splitted[0]] = unicode.encode(splitted[1]);
                        }
                    });
                    return asJson;
                }
            } else {
                console.log('No translations folder for path:', pathMap[key]);
                handleCallback()
            }
        });
    });
    return returnObj;
}

module.exports = i18n;
