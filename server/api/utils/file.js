import fs from 'fs';
import mkdirp from 'mkdirp';
import _path from 'path';
import _ from 'lodash';
import async from 'async';

export default class fileHandler {
    //delete file
    //move file
    delete = (file) => {
        const _this = this;
        return new Promise(function(resolve, reject) {
            if (Array.isArray(file)) {
                const promises = [];
                _.each(file, function(toDel) {
                    const url = _this.parseIfUploadFolder(toDel);
                    if (url !== '/images/gravatar.png') {
                        promises.push(resolve(
                            fs.unlinkSync(url, function(err) {
                                if (err) return err;
                                return true;
                            })
                        ));
                    } else {
                        promises.push(resolve(true));
                    }
                });

                Promise.all(promises).then(function(err, results) {
                    if (err) reject(err);
                    resolve(true);
                });
            } else {
                const url = _this.parseIfUploadFolder(file);
                resolve(
                    fs.unlinkSync(url, function(err) {
                        if (err) return err;
                        return true;
                    })
                );
            }
        });
    };

    deleteFolder = (path) => {
        return new Promise(function(resolve, reject) {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function(file, index) {
                    let curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) {
                        deleteFolderRecursive(curPath);
                    } else {
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
                resolve(true);
            } else {
                reject(false);
            }
        });
    };

    copy = (source, dest) => {
        return new Promise(function(resolve, reject) {
            mkdirp(_path.dirname(dest), function(err) {
                //Set up streams
                var sourceStream = fs.createReadStream(source),
                    destStream = fs.createWriteStream(dest);
                //Set up error handling
                sourceStream.on('error', reject);
                destStream.on('error', reject);

                //Set up end of source handling
                sourceStream.on('end', function() {
                    destStream.end();
                    resolve(true);
                });
                //Start moving
                sourceStream.pipe(destStream);
            });
        });
    };

    move = (sourceFile, destFile) => {
        const _this = this;

        return new Promise(function(resolve, reject) {
            _this.copy(sourceFile, destFile).then(function(res) {
                _this.delete(sourceFile).then(function(res) {
                    
                    resolve(_this.prettify(destFile));
                }, function(err) {
                    reject(err);
                });
            }, function(err) {
                reject(err);
            });
        });
    };

    prettify = (path) => {
        ///const dirs = _path.dirname(path).split(_path.sep);
        const startFrom = path.indexOf(`${_path.sep}uploads`);
        return path.slice(startFrom);
    };

    parseIfUploadFolder(url) {
        //const regex = /^\/uploads\//;
        const regex = new RegExp(`^\\${_path.sep}uploads\\${_path.sep}`);
        if (regex.test(url)) {
            return `server${url}`;
        }
        return url;
    }
}
