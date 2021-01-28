module.exports = function isScopeValid(
  [
    {
      header: { scope: scopes },
    },
  ],
  validScopes
) {
  const isRegex = /(^\/|\/$)/g;
  const validRegex = (valid, scope) =>
    new RegExp(valid.replace(isRegex, "")).test(scope);
  const validExact = (valid, scope) => valid === scope;

  return (
    !validScopes ||
    !scopes ||
    scopes
      .split(",")
      .map((scope) => scope.trim())
      .every((scope) =>
        validScopes.some((valid) => {
          console.log("scope:", valid, "test:", scope);
          return valid.match(isRegex)
            ? validRegex(valid, scope)
            : validExact(valid, scope);
        })
      )
  );
};
