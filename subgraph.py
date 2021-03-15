from jinja2 import Template
from json import load
import sys

supported_chains = ['mainnet', 'bsc']

if __name__ == '__main__':
  chain = 'mainnet'
  if len(sys.argv) > 1:
    chain = sys.argv[1]
  if chain not in supported_chains:
    raise Exception('invalid chain')

  with open(chain + '/setts.json') as j:
    settContracts = load(j)
  setts = [ value for key, value in settContracts.items() ]

  try:
    with open(chain + '/geysers.json') as j:
      geyserContracts = load(j)
    geysers = [ value for key, value in geyserContracts.items() ]
  except:
    geysers = []

  with open('subgraph.j2') as s:
      template = Template(s.read())
  
  with open(chain + '/subgraph.yaml', 'w') as t:
    t.write(template.render(chain=chain, setts=setts, geysers=geysers))
