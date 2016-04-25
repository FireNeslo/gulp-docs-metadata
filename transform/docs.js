var babylon = require('babylon')

module.exports = function annotate(babel) {
  var metadata = null, programs = []
  return {
    visitor: {
      CallExpression(path) {
        if(!metadata.events) metadata.events = []
        if(path.node.callee.property) {
          var method = path.node.callee.property.name
        }
        if(method === 'emit') {
          metadata.events.push(path.node.arguments[0].value)
        }
      },
      ClassExpression(path) {
        metadata.name = path.node.id.name
        if(!path.node.decorators) return;
        path.node.decorators.forEach(function(decorator) {
          if(decorator.expression.callee)  {
            var decorator = decorator.expression
            var name = decorator.callee.name
            metadata[name] || (metadata[name] = [])

            metadata[name].push(decorator.arguments.map(function (arg) {
              return arg.name || arg.value || null
            }))
          }
        })
      },
      ImportDeclaration(path) {
        metadata.imports[path.node.source.value] =  path.node
          .specifiers.map(function(id) {
            return id.local.name
          })
      },
      Program: {
        enter(path) {
          metadata = {imports: {}}
          path.container.comments.forEach(function (comment) {
            var annotation = /@([^\s]+\n?)([^\n]+\n[^@]+)/gm
            comment.value.replace(annotation, function(_, key, value) {
              metadata[key = key.trim()] || (metadata[key] = [])
              metadata[key].push(value.replace(/\*/g, '').trim())
            })
          })
        },
        exit(path) {
          if(programs.indexOf(path.node) > -1) return
          var json = JSON.stringify(metadata)
          var ast = babylon.parse('module.exports = ' + json + '')
          programs.push(ast.program)
          return path.replaceWith(ast.program)
        }
      }
    }
  };
}
