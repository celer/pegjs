(function(global) {

module("PEG.compiler.checks");

test("reports missing referenced rules", function() {
  var grammars = [
    'start = missing',
    'start = missing / "a" / "b"',
    'start = "a" / "b" / missing',
    'start = missing "a" "b"',
    'start = "a" "b" missing',
    'start = label:missing',
    'start = &missing',
    'start = !missing',
    'start = missing?',
    'start = missing*',
    'start = missing+',
    'start = missing { }'
  ];

  for (var i = 0; i < grammars.length; i++) {
    throws(
      function() {
        var ast = PEG.parser.parse(grammars[i]);
        PEG.compiler.checks.missingReferencedRules(ast);
      },
      PEG.GrammarError,
      { message: "Referenced rule \"missing\" does not exist." }
    );
  }
});

test("reports left recursion", function() {
  var grammars = [
    /* Direct */
    'start = start',
    'start = start / "a" / "b"',
    'start = "a" / "b" / start',
    'start = start "a" "b"',
    'start = label:start',
    'start = &start',
    'start = !start',
    'start = start?',
    'start = start*',
    'start = start+',
    'start = start { }',

    /* Indirect */
    'start = stop; stop = start'
  ];

  for (var i = 0; i < grammars.length; i++) {
    throws(
      function() {
        var ast = PEG.parser.parse(grammars[i]);
        PEG.compiler.checks.leftRecursion(ast);
      },
      PEG.GrammarError,
      { message: "Left recursion detected for rule \"start\"." }
    );
  }
});

})(this);
