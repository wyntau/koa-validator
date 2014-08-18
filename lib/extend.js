exports.check = check;
exports.sanitize = sanitize;

function check(methods){

  return methods;
}

function sanitize(methods){

  return methods;
}

function extend(methods, key, func){
  if(methods.hasOwnProperty(key)){
    throw new Error('already have method ' + key);
  }

  methods[key] = func;
}
