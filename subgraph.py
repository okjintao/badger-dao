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
    with open(chain + '/affiliate-vaults.json') as j:
      affiliateContracts = load(j)
    affiliate_vaults = [ value for key, value in affiliateContracts.items() ]
  except:
    affiliate_vaults = []

  with open('subgraph.j2') as s:
      template = Template(s.read())
  
  with open(chain + '/subgraph.yaml', 'w') as t:
    t.write(template.render(chain=chain, setts=setts, affiliate_vaults=affiliate_vaults))
