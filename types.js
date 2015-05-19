var fs=require("fs");
var aa=eval(fs.readFileSync("./selenium-webdriver-js.docset/Contents/Resources/Documents/types.js",{encoding:"utf8"}));

function processNode(node,name,href){
    for(var e in node){
        if(e=='types'){
            for(var i =0;i<node[e].length;i++){
                processNode(node[e][i],mergeName(name,node.name),node[e][i].href);
            }
        }
        if(e=='modules'){
            for(var i =0;i<node[e].length;i++){
                processNode(node[e][i],mergeName(name,node.name),node[e][i].href);
            }
        }
    }
    name=mergeName(name,node.name);
    if(node.href){
        href=node.href;
    }
    for(var e in node){
        if(e=='members'){
            for(var i =0;i<node[e].length;i++){
                addIndex(node[e][i]+"#"+name,href+"#"+node[e][i],"Method");
            }
        }
        if(e=='statics'){
            for(var i =0;i<node[e].length;i++){
                addIndex(mergeName(name,node[e][i]),href+"#"+node[e][i],"Function");
            }
        }
    }
    addIndex(name,href,"Class");
}

var sqlite3=require("sqlite3");
var db = new sqlite3.Database("./selenium-webdriver-js.docset/Contents/Resources/docSet.dsidx", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        function(err){
            if (err){
                console.log('FAIL on creating database ' + err);
            }
        });


function addIndex(name ,href,type){
    if(!name||!href){
        return;
    }
    console.log(name,"\t",href,"\t",type);
    db.run("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES (?, ?, ?);",
            [name,type,href],
            function(err){
                if (err){
                    console.log('FAIL on creating table ' + err);
                } 
            });
}

function mergeName(parentName,name){
    if(!parentName&&!name){
        return "";
    }else if(!parentName&&name){
        return name
    }else if(parentName&&!name){
        return parentName;
    }else {
        //return "("+parentName+")"+name;
        return name+"<"+parentName;
    }
}
processNode(TYPES,"","");
