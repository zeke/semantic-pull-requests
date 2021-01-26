const isScopeValid = require("../lib/is-scope-valid");

describe("isScopeValid", () => {
  test("allows parenthetical scope following the type", () => {
    expect(isScopeValid([{ scope: "subsystem" }], ["subsystem"])).toBe(true);
  });

  test("allows exact match on strings", () => {
    expect(isScopeValid([{ scope: "validScope" }], ["validScope"])).toBe(true);
    expect(isScopeValid([{ scope: "" }], [])).toBe(true);
    expect(isScopeValid([{ scope: null }], [])).toBe(true);
    expect(isScopeValid([{ scope: undefined }], [])).toBe(true);
    expect(isScopeValid([{ scope: "allowAllScopes" }], undefined)).toBe(true);
    expect(isScopeValid([{ scope: "allowAllScopes" }], null)).toBe(true);
  });

  test("rejects not match and substring matches", () => {
    expect(isScopeValid([{ scope: "bad" }], ["validScope"])).toBe(false);
    expect(isScopeValid([{ scope: "invalidScope" }], ["validScope"])).toBe(
      false
    );
  });

  test("Validates multiple scope combinations", () => {
    expect(isScopeValid([{ scope: "" }], [])).toBe(true);

    expect(
      isScopeValid(
        [{ scope: "validScope,anotherValidScope" }],
        ["validScope", "anotherValidScope"]
      )
    ).toBe(true);

    expect(
      isScopeValid(
        [{ scope: "validScope, spaceAndAnotherValidScope" }],
        ["validScope", "spaceAndAnotherValidScope"]
      )
    ).toBe(true);

    expect(
      isScopeValid([{ scope: "validScope, inValidScope" }], ["validScope"])
    ).toBe(false);
  });

  test("Validates regex scopes", () => {
    expect(
      isScopeValid([{ scope: "partialvalidScope" }], ["/validScope/"])
    ).toBe(true);

    expect(isScopeValid([{ scope: "partialvalidScope" }], ["validScope"])).toBe(
      false
    );

    expect(isScopeValid([{ scope: "validScope-1" }], ["validScope-\\d/"])).toBe(
      true
    );

    expect(
      isScopeValid(
        [{ scope: "validScope-1,validScope-2" }],
        ["/validScope-\\d/"]
      )
    ).toBe(true);

    expect(
      isScopeValid([{ scope: "validScope-10" }], ["/validScope-\\d+/"])
    ).toBe(true);

    expect(
      isScopeValid([{ scope: "validScope-10" }], ["/^validScope-\\d$/"])
    ).toBe(false);

    expect(
      isScopeValid(
        [{ scope: "TASK-1,TASK-0001,TASK-1234" }],
        ["/^TASK-(\\d)+$/"]
      )
    ).toBe(true);

    expect(
      isScopeValid(
        [{ scope: "TASK-1,TASK-0001,validScope" }],
        ["/^TASK-(\\d)+$/", "validScope"]
      )
    ).toBe(true);

    expect(
      isScopeValid(
        [{ scope: "TASK-1,TASK-0001,invalidScope" }],
        ["/^TASK-(\\d)+$/", "validScope"]
      )
    ).toBe(false);
  });
});
