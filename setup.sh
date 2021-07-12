#!/bin/zsh
typeset -a array

array=("mainnet" "bsc")

for i ("${array[@]}")
do
  yarn prepare:"$i"
  yarn codegen
done

# You can access them using echo "${arr[0]}", "${arr[1]}" also