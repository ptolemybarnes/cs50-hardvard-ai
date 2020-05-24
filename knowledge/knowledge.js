const uniq = collection => Array.from(new Set(collection))

const S = (a) => {
  const s = {
    formula: () => `S(${a})`,
  }
  s.ast = () => ({
    operation: 'S',
    nodes: [s],
    isPrimitive: true
  });
  return s
}

const Operations = {
  not: v => !v,
  or: (a, b) => (a || b),
  and: conditions => conditions.reduce((sum, next) => sum && next),
  implication: (condition, consequence) => (!condition || consequence)
}

const Not = (s) => ({
  formula: () => `(¬${s.formula()})`,
  value: () => !s.value(),
  ast: () => ({
    operation: 'not',
    nodes: [s.ast()]
  })
})

const Or = (a, b) => ({
  formula: () => `(${a.formula()} ∨ ${b.formula()})`,
  ast: () => ({
    operation: 'not',
    nodes: [a.ast(), b.ast()]
  })
});

const And = (...conditions) => ({
  formula: () => `(${conditions.map(c => c.formula()).join(' ^ ')})`,
  ast: () => ({
    operation: 'and',
    nodes: conditions.map(c => c.ast())
  })
})

const Implication = (condition, consequence) => ({
  formula: () => `((${condition.formula()}) => ${consequence.formula()})`,
  value: () => (!condition.value() || consequence.value()),
  ast: () => ({
    operation: 'implication',
    nodes: [condition.ast(), consequence.ast()]
  })
})

// QUESTION: DO WE KNOW THAT IT WAS RAINING?

const rain = S("rain") // it's raining
const hagrid = S("Hagrid") // harry visited hagrid
const dumbledore = S("dumbledore") // harry visited dumbledore

const knowledge = And(
  Implication(Not(rain), hagrid),
  Or(hagrid, dumbledore),
  Not(And(hagrid, dumbledore)),
  dumbledore // we know that harry visited dumbledore
);

// gets all symbols
const getSymbols = (node, symbols = []) => {
  if (node.isPrimitive) {
    return uniq([...symbols, node.nodes[0]])
  }
  return uniq(node.nodes.flatMap(n => getSymbols(n, symbols)))
}

console.log(getSymbols(knowledge.ast()).map(s => s.formula()))
