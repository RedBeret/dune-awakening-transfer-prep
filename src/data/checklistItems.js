export const checklistItems = [
  {
    id: 'backupBases',
    kind: 'required',
    title: 'Back up base(s)',
    detail: 'Use the Base Reconstruction Tool first. Unbacked bases are left behind.'
  },
  {
    id: 'backupVehicles',
    kind: 'required',
    title: 'Back up vehicles',
    detail: 'Use the Vehicle Backup Tool. Disassemble or bank extras if needed.'
  },
  {
    id: 'storeValuables',
    kind: 'required',
    title: 'Store valuables in inventory or bank',
    detail: 'Inventory, bank contents and Solari transfer. Bank important items before moving.'
  },
  {
    id: 'clearMarketplace',
    kind: 'recommended',
    title: 'Cancel marketplace listings',
    detail: 'Items left listed on the marketplace do not transfer.'
  },
  {
    id: 'inHagga',
    kind: 'required',
    title: 'Move to Hagga Basin',
    detail: 'Transfer flow starts only while your character is in Hagga Basin.'
  },
  {
    id: 'tokenReady',
    kind: 'required',
    title: 'Confirm transfer token is ready',
    detail: 'One token is available per 7 day cooldown. Return moves also need a token.'
  },
  {
    id: 'namePlan',
    kind: 'recommended',
    title: 'Plan for possible name conflict',
    detail: 'If the target server already has your name, the game prompts for a new one.'
  }
];
