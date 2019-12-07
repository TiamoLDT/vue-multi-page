//多页面路由跳转
function makePath(module, path, query) {
    var href = location.href.split("rsrc=")[0];
    if (location.pathname.indexOf(".html") === -1) {
      href = href.split("#")[0] + "index.html"
    }
    path = path || "/";
    var rsrc = encodeURIComponent(location.href.split("rsrc=")[0]);
    if (path.indexOf("?") == -1) {
      path += "?rsrc=" + rsrc;
    } else {
      path += "&rsrc=" + rsrc;
    }
    query = query || "";
    return href.replace(/(.*)(\/.*?)\.html(.*)/, "$1/" + module + ".html" + query + "#" + path);
  }

  export {
    makePath
  }