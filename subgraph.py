from jinja2 import Template
from json import load

if __name__ == '__main__':
  with open('setts.json') as j:
    jars = load(j)
  contracts = [ value for key, value in jars.items() ]

  with open('subgraph.j2') as s:
      template = Template(s.read())
  
  with open('subgraph.yaml', 'w') as t:
    t.write(template.render(contracts=contracts))
