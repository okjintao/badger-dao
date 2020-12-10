from jinja2 import Template
from json import load

if __name__ == '__main__':
  with open('setts.json') as j:
    settContracts = load(j)
  setts = [ value for key, value in settContracts.items() ]

  with open('geysers.json') as j:
    geyserContracts = load(j)
  geysers = [ value for key, value in geyserContracts.items() ]

  with open('subgraph.j2') as s:
      template = Template(s.read())
  
  with open('subgraph.yaml', 'w') as t:
    t.write(template.render(setts=setts, geysers=geysers))
