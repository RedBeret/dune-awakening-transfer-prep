export const checklistItems = [
  {
    id: 'eligibility',
    kind: 'required',
    title: 'Confirm transfer eligibility and destination acceptance',
    detail:
      'Private → Official is not supported. Official → Private is conditional on the destination private server accepting transfers. Destination must be available (not maintenance, not offline, not weekly active limit).'
  },
  {
    id: 'backupBases',
    kind: 'required',
    title: 'Back up base(s)',
    detail:
      'Use the Base Reconstruction Tool (Hagga Basin only). Verify backup succeeds: sub-fief console must be on a foundation and all buildables must be inside sub-fief bounds. Tool stores up to 3 bases.'
  },
  {
    id: 'backupVehicles',
    kind: 'required',
    title: 'Back up vehicles',
    detail:
      'Use the Vehicle Backup Tool. If a vehicle can’t be stored normally, remove inventory or relocate it, or disassemble with a Welding Torch and store parts.'
  },
  {
    id: 'storeValuables',
    kind: 'required',
    title: 'Store valuables in inventory or bank',
    detail:
      'Inventory, bank contents and Solari transfer. Put anything high-value in inventory or bank, not in-world containers.'
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
    detail:
      'Account starts with 1 token (max hold is 1). Token replenishes after 7 days. Any additional transfer, including moving back, costs another token.'
  },
  {
    id: 'confirmScreen',
    kind: 'required',
    title: 'Read confirmation screen and complete text entry',
    detail:
      'The game shows key limitations and items that may be lost. You must acknowledge limitations and perform manual text entry to proceed.'
  },
  {
    id: 'noDisconnect',
    kind: 'required',
    title: 'Do not disconnect during transfer',
    detail:
      'Exiting the flow or closing the session cancels the transfer. While a character is “In Transfer”, you cannot initiate other transfers on the account.'
  },
  {
    id: 'namePlan',
    kind: 'recommended',
    title: 'Plan for possible name conflict',
    detail: 'If the target server already has your name, the game prompts for a new one.'
  },
  {
    id: 'postTransferValidate',
    kind: 'recommended',
    title: 'Plan post-transfer validation',
    detail:
      'After success you spawn at Griffin’s Reach. Validate inventory, bank, Solari, and backups in BRT and VBT before rebuilding.'
  }
];
