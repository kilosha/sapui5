const cds = require('@sap/cds')
module.exports = function (){
  // Register your event handlers in here, for example, ...
  this.after ('READ','Books', each => {
    if (each.stock > 11) {
      each.title += ` -- 11% discount!`
    }
  })
}
