# Market Files — research handoff for Claude

Research date: 2026-10-12. Scope: Crypto, Gold & Silver, Stocks, Global politics & markets, and a separate Learn hub. Educational purposes only; not financial advice. This is a research document, not an implementation or a trading service.

Owner update: Learn resources must be free and publicly accessible without membership, subscription, payment or mandatory account creation. Public documents from organizations that also offer memberships are eligible; their gated products are not. No accounts were created, transactions made, code changed or deployments performed.

Editorial handling: publish confirmed items with their sources and dates; retain UNVERIFIED items as internal research holds. A retrieved public page is not proof that every linked interactive feature works. Registry examples are non-exhaustive snapshots of exact legal entities, not recommendations or permission to serve every customer. Dates shown only to month precision remain YYYY-MM, rather than inventing a day.

## Hub 1: Crypto

### Learn the basics

- **Blockchain**: A blockchain links blocks of records cryptographically; Bitcoin uses a distributed proof-of-work history to address double spending without a central payment processor. Source: <https://bitcoin.org/bitcoin.pdf> (opened 2026-10-12).

- **Proof of work**: Bitcoin miners perform computational work to propose blocks; other nodes check the blocks against the network rules. Source: <https://bitcoin.org/bitcoin.pdf> (opened 2026-10-12).

- **Proof of stake**: Ethereum replaced proof-of-work consensus with proof of stake at the Merge on 2022-09-15; validators stake ETH rather than compete through mining. Source: <https://ethereum.org/roadmap/merge/> (opened 2026-10-12).

- **Ethereum**: Ethereum supports programmable smart contracts and applications; ETH is its native asset, distinct from tokens created by applications. Source: <https://ethereum.org/what-is-ethereum/> (opened 2026-10-12).

- **Stablecoins**: Stablecoins aim to track a reference value, often a currency; the peg and any redemption mechanism introduce risks rather than eliminating them. Source: <https://ethereum.org/stablecoins/> (opened 2026-10-12).

- **Keys and recovery**: A wallet manages access credentials rather than storing the coins themselves; private keys authorize transactions and recovery phrases can restore access. Anyone obtaining those secrets may obtain control. Source: <https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0> (opened 2026-10-12).

- **Gas**: Gas measures computational work on Ethereum; a transaction fee combines the gas used with its price. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **DeFi**: Decentralized finance uses blockchain applications for activities such as swaps and lending; smart contracts and their interfaces can introduce technical and governance risks. Source: <https://ethereum.org/defi/> (opened 2026-10-12).

- **NFTs**: Non-fungible tokens identify distinct tokens; a token record does not by itself establish every legal right to an associated image or other asset. Source: <https://ethereum.org/nft/> (opened 2026-10-12).

- **Layer 2**: Ethereum layer-2 systems process activity outside the base chain while deriving security from Ethereum; the specific design and withdrawal arrangements matter. Source: <https://ethereum.org/layer-2/> (opened 2026-10-12).

### Bitcoin: history and white paper

- **White paper and first announcement**: The paper is titled Bitcoin: A Peer-to-Peer Electronic Cash System and names Satoshi Nakamoto as author. The surviving Cryptography mailing-list announcement is dated 2008-10-31 and links to the paper on bitcoin.org; that establishes the public announcement, not the author’s real-world identity. Source: <https://bitcoin.org/bitcoin.pdf>; <https://www.metzdowd.com/pipermail/cryptography/2008-October/014810.html> (opened 2026-10-12).

- **Genesis block**: Bitcoin Core encodes the main-network genesis timestamp as 1231006505, corresponding to 2009-01-03 18:15:05 UTC. This is the block’s recorded timestamp, not independent evidence of the exact moment a person created it. Source: <https://github.com/bitcoin/bitcoin/blob/master/src/kernel/chainparams.cpp> (opened 2026-10-12).

- **Supply schedule**: Under Bitcoin’s present issuance rules, the subsidy halves every 210,000 blocks and total issuance approaches the commonly stated 21 million BTC limit. Lost keys do not increase that limit. Source: <https://bitcoin.org/en/halving> (opened 2026-10-12).

- **2012 halving**: 2012-11-28: block 210,000 reduced the block subsidy from 50 to 25 BTC. Source: <https://bitcoin.org/en/halving> (opened 2026-10-12).

- **2016 halving**: 2016-07-09: block 420,000 reduced the subsidy from 25 to 12.5 BTC. Source: <https://bitcoin.org/en/halving> (opened 2026-10-12).

- **2020 halving**: 2020-05-11: block 630,000 reduced the subsidy from 12.5 to 6.25 BTC. Source: <https://bitcoin.org/en/halving> (opened 2026-10-12).

- **2024 halving**: 2024-04-20 UTC: block 840,000 reduced the subsidy from 6.25 to 3.125 BTC; the event fell on 2024-04-19 in US Eastern time. Subsidy is newly issued bitcoin; a miner’s total block revenue can also include transaction fees. Source: <https://bitcoin.org/en/halving> (opened 2026-10-12).

- **Additional milestones — research hold**: UNVERIFIED: exact primary-source citations for first transfer, early exchange trading, SegWit, Taproot and the US spot-bitcoin ETP approval were not completed in this pack; do not fill this timeline from memory. Source: <https://bitcoin.org/bitcoin.pdf> (opened 2026-10-12).

### Wallets

- **Custody distinctions**: Hot wallets are connected to the internet; cold storage keeps signing keys offline. Self-custody places key management with the user, while third-party custody adds dependence on the custodian and its legal arrangements. Source: <https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0> (opened 2026-10-12).

For every wallet below, regulatory licence name/number/date is UNVERIFIED unless explicitly stated; a software repository or security audit is not a financial-services licence. Unverified incident history means “not established in this review,” never “no incidents.” Hardware purchases and wallet use are adult research topics, outside the Learn hub’s free-resource list.

- **Ledger**: Ledger describes a hardware-signing model and publishes the Ledger Wallet application’s source, while portions of its device operating system remain closed. Audit firm/date and licence details for the specific product version are UNVERIFIED here. Source: <https://www.ledger.com/academy/topics/ledgersolutions/is-ledger-open-source> (opened 2026-10-12).

- **Ledger incident**: Ledger’s report describes the 2023-12-14 Connect Kit compromise affecting a JavaScript integration used by applications. Do not describe that report as proof that hardware-device private keys were extracted. Source: <https://www.ledger.com/blog/security-incident-report> (opened 2026-10-12).

- **Trezor**: Trezor publishes its firmware monorepo, enabling inspection of the code and its licences. This confirms source availability; a model-specific custody description, audit report/date and dated incident assessment remain UNVERIFIED in this pack. Source: <https://github.com/trezor/trezor-firmware> (opened 2026-10-12).

- **COLDCARD**: Coinkite publishes COLDCARD hardware-wallet firmware and simulator code; source availability should not be casually relabelled as an unrestricted open-source licence. Its repository also carries a seed-generation security advisory, so any product description must refer readers to the current manufacturer advisory rather than imply immunity from vulnerabilities. Source: <https://github.com/Coldcard/firmware>; <https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/> (opened 2026-10-12).

- **Blockstream Jade**: Blockstream publishes Jade hardware-wallet firmware, build instructions and licence files. That establishes public source availability; model-specific audit firm/date, incident chronology and all third-party service dependencies remain UNVERIFIED here. Source: <https://github.com/Blockstream/Jade>; <https://blockstream.com/jade/> (opened 2026-10-12).

- **Keystone**: Keystone publishes its Keystone 3 firmware; Least Authority’s final audit dated 2025-03-20 examined specified Zcash integration code, signing and QR-protocol components. This is a defined software scope, not a certification of every supported chain, physical component or later firmware version; comprehensive incident history is UNVERIFIED. Source: <https://github.com/KeystoneHQ/keystone3-firmware>; <https://leastauthority.com/wp-content/uploads/2025/03/Least-Authority-ZCG-Keystone-Hardware-Wallet-Final-Audit-Report.pdf> (opened 2026-10-12).

- **MetaMask**: The MetaMask browser-extension source is publicly available in its official repository; inspect the current licence before describing reuse rights. Exact-version custody/recovery options, audit coverage and incident history remain UNVERIFIED in this pack. Source: <https://github.com/MetaMask/metamask-extension> (opened 2026-10-12).

- **Phantom**: Phantom describes its wallet as self-custodial; its current homepage also advertises trading, perpetuals and prediction products, which should not be promoted as children’s learning games. Complete application source availability, audit firm/date and incident history remain UNVERIFIED. Source: <https://phantom.com/> (opened 2026-10-12).

- **Trust Wallet**: Trust Wallet describes a self-custody mobile and browser wallet, and Cure53 published a browser-extension security report in 2023-04. That report covers a particular extension review, not an assurance about all present releases; whole-application open-source status and a complete incident chronology remain UNVERIFIED. Source: <https://trustwallet.com/>; <https://trustwallet.com/assets/files/cure53_tw_browser_extension_04.2023.pdf> (opened 2026-10-12).

- **Exodus**: Exodus states that parts of its code are open source while other parts are not. Do not label the entire application fully open source; version-specific audit coverage, custody/recovery details and dated incidents remain UNVERIFIED here. Source: <https://www.exodus.com/support/en/articles/8598678-is-exodus-open-source> (opened 2026-10-12).

- **Coinbase Wallet**: The opened Coinbase Wallet page establishes a separate wallet-branded product, but does not provide enough retrieved detail to verify every custody/recovery configuration. UNVERIFIED: present product naming across Wallet/Base, full source status, audited version/date and incident chronology; do not transfer a Coinbase exchange licence to the wallet. Source: <https://wallet.coinbase.com/> (opened 2026-10-12).

- **Rabby**: RabbyHub publishes the Rabby extension repository for Ethereum and EVM-chain use. Source is available, but a named, dated audit report, current-version custody details and an incident chronology remain UNVERIFIED here. Source: <https://github.com/RabbyHub/Rabby> (opened 2026-10-12).

- **How to vet a wallet**: Check who controls keys, recovery dependencies, the exact download publisher, code availability, version-specific audit findings and remediation. For third-party custody, check the legal entity, asset segregation, insurance exclusions and insolvency terms; a familiar brand name is insufficient. Source: <https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0> (opened 2026-10-12).

### Exchanges by country

Read “registered,” “licensed,” “authorised” and “in-principle approval” as different statuses. Check the exact entity, official domain, permitted activity, territory and current restrictions directly in the regulator’s record; the examples below are not an exhaustive list.

- **United States**: NYDFS’s New York list shows Coinbase, Inc. with Virtual Currency and Money Transmitter Licenses granted 2017-01, and Gemini Trust Company, LLC with a Limited Purpose Trust Charter granted 2015-10. These are New York entries, not nationwide authorisation; licence numbers and a complete federal/state framework are UNVERIFIED in this pack. Source: <https://www.dfs.ny.gov/apps_and_licensing/virtual_currency_businesses> (opened 2026-10-12).

- **Canada**: The CSA authorised-platform list includes Coinbase Canada Inc., Payward Canada Inc. (Kraken), and Foris DAX CAN ULC (Crypto.com), with linked regulatory decisions. Match the entity and province/territory and read the decision’s conditions; the list includes firms with restrictions, so a listed name alone is insufficient. Source: <https://www.securities-administrators.ca/crypto-platforms-regulation-and-enforcement-actions/crypto-platforms-authorized-to-do-business-with-canadians/> (opened 2026-10-12).

- **United Kingdom**: The FCA says in-scope cryptoasset businesses must register under the money-laundering regulations; its page states that the new FSMA cryptoasset regime begins 2027-10-25. Current individual register entries and registration numbers were not successfully verified, so no exchange is labelled authorised here. Source: <https://www.fca.org.uk/firms/cryptoassets/who-needs-register>; <https://www.fca.org.uk/firms/new-regime-cryptoasset-regulation/registration-under-mlrs-ahead-new-fsma-regime> (opened 2026-10-12).

- **EU (MiCA)**: ESMA provides the interim MiCA register, including crypto-asset service providers, and identifies the relevant national competent authorities. Use the CASP record’s service scope, home authority and withdrawal fields; the downloadable firm dataset could not be retrieved, so individual names are UNVERIFIED here. Source: <https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica> (opened 2026-10-12).

- **Germany**: UNVERIFIED register entries: the BaFin company-database page could not be opened. Check BaFin alongside the ESMA MiCA record for the exact legal entity and service scope before publishing a Germany availability claim. Source attempted: <https://www.bafin.de/EN/PublikationenDaten/Datenbanken/Unternehmenssuche/unternehmenssuche_node_en.html> (attempted 2026-10-12).

- **France**: UNVERIFIED register entries: AMF whitelist retrieval failed. Verify a current PSCA/MiCA record and permitted services directly; do not substitute an old PSAN registration for current authorisation. Source attempted: <https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-blanches> (attempted 2026-10-12).

- **Japan**: The FSA’s list dated 2026-09-01 includes bitFlyer, Inc. (Kanto No.00003) and bitbank, inc. (Kanto No.00004), both registered 2017-09-29. Match the registration number, corporate identity and permitted assets; the document does not endorse the assets listed. Source: <https://www.fsa.go.jp/en/regulated/licensed/en_kasoutuka.pdf> (opened 2026-10-12).

- **South Korea**: KoFIU and FSS’s 2026-10-01 release reports a survey of 26 registered VASPs covering 2026-01-01 through 2026-06-30. That survey is not a live firm register: current names, registration numbers, restrictions and the full legal-framework summary remain UNVERIFIED. Source: <https://www.fsc.go.kr/eng/pr010101/87833> (opened 2026-10-12).

- **Singapore**: MAS’s directory shows COINBASE SINGAPORE PTE. LTD. as a Major Payment Institution with Digital Payment Token Service and Cross-border Money Transfer Service. Match the legal entity and listed activity; the retrieved record did not establish a licence number or grant date, and does not imply approval of every advertised product. Source: <https://eservices.mas.gov.sg/fid/institution/detail/235467-COINBASE-SINGAPORE-PTE-LTD> (opened 2026-10-12).

- **Australia**: AUSTRAC announced a public virtual-asset service-provider register on 2026-06-30, replacing the old digital-currency-exchange terminology. The register returned no usable firm rows in this review, so current exchange names and registration numbers remain UNVERIFIED; AML registration should not be described as an investment guarantee. Source: <https://www.austrac.gov.au/news-and-media/article/virtual-asset-service-provider-register-goes-public> (opened 2026-10-12).

- **India**: FIU-IND’s downloads page lists VDA AML/CFT guidance updated 2026-01-08 and a registration circular dated 2025-09-15. A current exchange-by-exchange official register was not verified, so names, registration numbers and permissions remain UNVERIFIED. Source: <https://fiuindia.gov.in/files/downloads/downloads.html> (opened 2026-10-12).

- **Brazil**: UNVERIFIED: the Banco Central page for Resolução BCB 520 returned only a JavaScript shell. Its operative framework, authorisation transition, current register and firm entries require verification before publication. Source attempted: <https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=520&tipo=resolu%C3%A7%C3%A3o+bcb> (attempted 2026-10-12).

- **UAE — Dubai VARA record**: VARA’s register lists Rain MENA FZE as Active, VASP Licence VL/26/10/001, issued 2026-10-05, for Exchange and Broker-Dealer Services. VARA expressly says in-principle approval does not permit operations; broader UAE, DIFC and ADGM permissions are not established by this entry. Source: <https://www.vara.ae/en/licenses-and-register/public-register/> (opened 2026-10-12).

### How-to guides

- **Wallet setup and backup lesson**: Teach learners to identify the official publisher, understand the recovery method and protect the recovery phrase from disclosure. Use fictional examples rather than asking anyone to enter real wallet secrets into a lesson. Source: <https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0> (opened 2026-10-12).

- **Send, receive and test transactions**: A Bitcoin address identifies a payment destination; confirmations indicate incorporation into the blockchain. Proposed lesson: compare the complete destination and intended network, explain fees, and illustrate a small test transfer without asking students to send money; a test does not prove a recipient is trustworthy. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Exchange account, identity checks, buy and sell**: UNVERIFIED as a universal click-by-click guide: interfaces, eligibility, required identity documents and order flows differ by legal entity and country. Claude should teach the concepts using labelled mock screens and verified local regulator records, rather than inventing a live onboarding sequence. Source: <https://www.fca.org.uk/firms/cryptoassets/who-needs-register> (opened 2026-10-12).

- **Tax records — US example**: The IRS digital-assets page explains reporting and records, including transaction dates, units, value and basis. A crypto-to-crypto transaction can matter for tax reporting; do not assume that only conversion into bank money matters. Source: <https://www.irs.gov/filing/digital-assets> (opened 2026-10-12).

- **Tax authority — United States**: IRS digital-assets guidance. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source: <https://www.irs.gov/filing/digital-assets> (opened 2026-10-12).

- **Tax authority — United Kingdom**: HMRC cryptoassets collection. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source: <https://www.gov.uk/government/collections/cryptoassets> (opened 2026-10-12).

- **Tax authority — Canada**: UNVERIFIED access: CRA cryptocurrency guidance; retrieval failed. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source attempted: <https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/cryptocurrency.html> (attempted 2026-10-12).

- **Tax authority — Australia**: UNVERIFIED access: ATO crypto-asset guidance; retrieval failed. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source attempted: <https://www.ato.gov.au/individuals-and-families/investments-and-assets/crypto-asset-investments> (attempted 2026-10-12).

- **Tax authority — Singapore**: UNVERIFIED access: IRAS investment-gains guidance; retrieval failed. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source attempted: <https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/what-is-taxable-what-is-not/gains-from-the-sale-of-property-shares-and-financial-instruments> (attempted 2026-10-12).

- **Tax authority — Germany**: UNVERIFIED access: Federal Finance Ministry tax page; retrieval failed. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source attempted: <https://www.bundesfinanzministerium.de/Web/EN/Topics/Taxation/taxation.html> (attempted 2026-10-12).

- **Tax authority — France**: DGFiP public individual-tax portal. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source: <https://www.impots.gouv.fr/particulier> (opened 2026-10-12).

- **Tax authority — Japan**: National Tax Agency English portal. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source: <https://www.nta.go.jp/english/> (opened 2026-10-12).

- **Tax authority — South Korea**: National Tax Service English portal. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source: <https://www.nts.go.kr/english/main.do> (opened 2026-10-12).

- **Tax authority — India**: Income Tax Department portal. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source: <https://www.incometax.gov.in/iec/foportal/> (opened 2026-10-12).

- **Tax authority — Brazil**: Receita Federal portal. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source: <https://www.gov.br/receitafederal/pt-br> (opened 2026-10-12).

- **Tax authority — UAE**: Federal Tax Authority portal. This is an official-reference pointer, not a determination of rates, exemptions or a particular person’s liability. Source: <https://tax.gov.ae/en/> (opened 2026-10-12).

EU: no single member-country personal crypto-tax treatment is asserted; use the national authority for the relevant residence and transaction. Germany and France pointers are above.

### Terminology

- **Address**: Payment destination identifier. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Bitcoin**: Peer-to-peer electronic payment network. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **BTC**: Common bitcoin unit abbreviation. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Bit**: One millionth of a bitcoin. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Block**: Grouped transactions linked into the chain. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Blockchain**: Shared, ordered history of blocks. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Confirmation**: Transaction inclusion followed by additional blocks. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Cryptography**: Mathematical techniques securing information. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Double spend**: Attempt to spend the same funds twice. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Hash rate**: Mining computations performed per second. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Mining**: Proof-of-work block production. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **P2P**: Peer-to-peer network architecture. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Private key**: Secret used to authorize spending. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Signature**: Cryptographic evidence of authorization. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Wallet**: Software or hardware managing payment access. Source: <https://bitcoin.org/en/vocabulary> (opened 2026-10-12).

- **Account**: Ethereum state associated with an address. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Block explorer**: Interface for inspecting blockchain records. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Consensus**: Agreement on a valid chain state. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **dapp**: Application using decentralized blockchain components. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **DAO**: Organization coordinated through on-chain rules. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Ether**: Ethereum’s native asset. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **EVM**: Ethereum Virtual Machine. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Finality**: Consensus assurance against reversing finalized blocks. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Fork**: Divergence in protocol rules or chain history. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Gas**: Unit measuring computation. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Gwei**: One billion wei. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Hash**: Fixed-length cryptographic digest. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Mainnet**: Primary live blockchain network. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Node**: Computer participating in a blockchain network. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Nonce**: Counter preventing account transaction replay. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Oracle**: Mechanism supplying external information on-chain. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Public key**: Public cryptographic counterpart to a private key. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Rollup**: Execution system posting commitments to a base chain. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Slashing**: Penalty for certain validator misconduct. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Smart contract**: Program executed under blockchain rules. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Staking**: Committing assets to proof-of-stake validation. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Testnet**: Network used for testing. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Token**: Asset represented by blockchain rules. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Transaction**: Signed instruction changing blockchain state. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Validator**: Participant proposing or attesting to blocks. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

- **Wei**: Smallest denomination of ether. Source: <https://ethereum.org/glossary/> (opened 2026-10-12).

### News and channels

- **Regulator and law-enforcement releases**: Use original FCA, SEC/Investor.gov, FTC and DOJ material to distinguish rules, allegations, settlements and judgments. These are primary accounts of the institution’s own actions, not guarantees that every disputed allegation has been proven. Source: <https://www.fca.org.uk/firms/cryptoassets/who-needs-register>; <https://www.ftc.gov/legal-library/browse/cases-proceedings/2223149-voyager-digital-llc-et-al-ftc-v>; <https://www.justice.gov/usao-sdny/united-states-v-kwon-23-cr-151-pae-terraform-labs-fraud> (opened 2026-10-12).

- **Project documentation and code**: Bitcoin Core’s source and Ethereum’s documentation provide direct evidence of published implementation and protocol design. Attribute issuer claims and separate documentation from independent security assessment. Source: <https://github.com/bitcoin/bitcoin/blob/master/src/kernel/chainparams.cpp>; <https://ethereum.org/roadmap/merge/> (opened 2026-10-12).

- **Selected recent development — Terra criminal case**: DOJ’s case page records Do Kwon’s 2025-12-11 sentence of 15 years. This falls within the review window of 2025-10-12 through 2026-10-12; it is a dated case outcome, not a claim about final creditor recoveries. Source: <https://www.justice.gov/usao-sdny/united-states-v-kwon-23-cr-151-pae-terraform-labs-fraud> (opened 2026-10-12).

- **Selected recent development — Celsius FTC resolution**: The FTC’s 2026-07 release reports orders requiring Celsius founders to pay a combined $16.5 million to resolve its charges. Keep this civil action separate from Mashinsky’s criminal sentence and bankruptcy recoveries. Source: <https://www.ftc.gov/news-events/news/press-releases/2026/07/founders-celsius-network-ordered-pay-165-million-resolve-ftc-charges> (opened 2026-10-12).

- **Selected recent development — Australian public register**: AUSTRAC’s public VASP register launch on 2026-06-30 changes how readers can check a provider. The announcement is verified, while individual live entries were not retrieved. Source: <https://www.austrac.gov.au/news-and-media/article/virtual-asset-service-provider-register-goes-public> (opened 2026-10-12).

- **Editorial scope of recent news**: UNVERIFIED: a defensible comprehensive “biggest headlines” selection, independent news-outlet/channel assessments and fully tested explorer links were not completed. The three items above are selected verified developments, not a ranked annual news digest. Source: <https://www.fsc.go.kr/eng/pr010101/87833> (opened 2026-10-12).

### Risks

- **Mt. Gox**: DOJ’s 2023-06-09 announcement alleges laundering of approximately 647,000 bitcoin stolen from Mt. Gox and describes theft contributing to insolvency. The 2014 closure/bankruptcy chronology and current rehabilitation distributions require trustee/court verification; criminal charges are not convictions. Source: <https://www.justice.gov/usao-sdny/pr/russian-nationals-charged-hacking-one-cryptocurrency-exchange-and-illicitly-operating> (opened 2026-10-12).

- **QuadrigaCX**: UNVERIFIED in this review: OSC report and HTML retrieval failed, so the requested 2019 failure chronology and outcomes are held for verification. Do not publish the simplified “all keys were lost” story without checking the OSC findings. Source attempted: <https://www.osc.ca/quadrigacxreport/>; <https://www.osc.ca/quadrigacxreport/web/files/QuadrigaCX-A-Review-by-Staff-of-the-Ontario-Securities-Commission.pdf> (attempted 2026-10-12).

- **Celsius**: Celsius filed for bankruptcy on 2022-07-13; DOJ announced on 2025-05-08 that founder Alexander Mashinsky was sentenced to 12 years for fraud and market manipulation. That sentence does not establish an individual customer’s recovery. Source: <https://www.justice.gov/usao-sdny/pr/founder-celsius-sentenced-12-years-fraud-and-market-manipulation> (opened 2026-10-12).

- **Voyager**: The FTC’s case page describes misleading deposit-insurance claims and a settlement permanently banning Voyager from handling consumer assets. The platform’s 2022 bankruptcy and the later FTC case should be separated; exact bankruptcy date and current distributions remain UNVERIFIED here. Source: <https://www.ftc.gov/legal-library/browse/cases-proceedings/2223149-voyager-digital-llc-et-al-ftc-v> (opened 2026-10-12).

- **FTX**: DOJ announced on 2024-03-28 that Samuel Bankman-Fried was sentenced to 25 years for fraud following FTX’s collapse. This criminal outcome is distinct from the 2022 bankruptcy, appeals and subsequent creditor payments, whose current status was not checked. Source: <https://www.justice.gov/usao-sdny/pr/samuel-bankman-fried-sentenced-25-years-prison> (opened 2026-10-12).

- **Terra/Luna**: The DOJ case concerns Terraform’s fraud and the collapse of its ecosystem; the case page records Kwon’s guilty plea and 2025-12-11 sentence. Exact May 2022 peg-loss chronology and later recovery percentages are UNVERIFIED here. Source: <https://www.justice.gov/usao-sdny/united-states-v-kwon-23-cr-151-pae-terraform-labs-fraud> (opened 2026-10-12).

- **Bybit hack**: On 2025-02-26, the FBI attributed approximately $1.5 billion in virtual-asset theft from Bybit on or about 2025-02-21 to North Korea’s TraderTraitor activity. This is a historical incident outside the last-12-month window; total recovered funds are UNVERIFIED. Source: <https://www.fbi.gov/investigate/cyber/alerts/2025/north-korea-responsible-for-1-5-billion-bybit-hack> (opened 2026-10-12).

## Hub 2: Gold & Silver

### Learn the basics

- **Spot and retail price**: Spot is a cash-market price for immediate metal delivery; a retail coin or bar price also reflects premiums and other costs. Compare like weight and purity, not just the headline price. Source: <https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/Metals10Things.html> (opened 2026-10-12).

- **Gold futures**: COMEX Gold’s standard trading unit is 100 troy ounces, with a minimum price increment of $0.10 per ounce, or $10 per contract. Its delivery rules specify minimum 995 fineness and approved brands; delivery tolerances differ from the trading unit. Source: <https://www.cmegroup.com/rulebook/COMEX/1a/113.pdf> (opened 2026-10-12).

- **Silver futures**: COMEX Silver’s standard trading unit is 5,000 troy ounces. The contract has specified delivery requirements, so a silver futures quote is not interchangeable with a local dealer’s retail bar offer. Source: <https://www.cmegroup.com/rulebook/COMEX/1a/112.pdf> (opened 2026-10-12).

- **LBMA benchmarks**: LBMA Gold Price auctions commence at 10:30 and 15:00 London time; the Silver Price auction commences at noon, on publication days. ICE Benchmark Administration administers these benchmarks; “fix” should not be used to imply a continuously executable retail price. Source: <https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices> (opened 2026-10-12).

- **Gold/silver ratio — illustrative calculation**: Proposed classroom example: if comparable gold and silver prices are $2,400 and $30 per troy ounce, dividing gold by silver gives 80. These are invented teaching prices, not current quotes; keep currency, unit and observation time consistent. Source: <https://www.cmegroup.com/rulebook/COMEX/1a/113.pdf>; <https://www.cmegroup.com/rulebook/COMEX/1a/112.pdf> (opened 2026-10-12).

- **Silver has multiple demand channels**: The Silver Institute’s supply-and-demand material separates industrial fabrication from jewellery, silverware and investment demand. It is an industry source, so identify its publisher rather than presenting it as a government statistical agency. Source: <https://silverinstitute.org/silver-supply-demand/> (opened 2026-10-12).

### What moves prices

- **Gold supply and demand**: World Gold Council’s Gold Demand Trends publishes sector and country data on demand alongside supply analysis. Use the report period and revisions, and identify WGC as an industry body. Source: <https://www.gold.org/goldhub/research/gold-demand-trends> (opened 2026-10-12).

- **Central-bank holdings**: WGC’s country reserve dataset is a reference for reported official gold holdings; observe its reporting dates and methodology. A country’s latest reported figure is not necessarily a same-day inventory. Source: <https://www.gold.org/goldhub/data/gold-reserves-by-country> (opened 2026-10-12).

- **Positioning**: CFTC Commitments of Traders reports describe reportable futures-market positioning by categories. Positioning data are not a complete measure of physical-metal demand or a forecast of the next price move. Source: <https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm> (opened 2026-10-12).

- **Rates, currency and uncertainty**: WGC’s 2020 analysis discusses uncertainty, low interest rates, dollar movements and investment demand. Present these as interacting influences rather than a rule that gold must rise whenever inflation rises. Source: <https://www.gold.org/goldhub/research/investment-update-gold-hits-record-high-sprint-or-marathon> (opened 2026-10-12).

### Ways to own

- **Physical bullion**: Coins and bars involve ownership, delivery and storage arrangements as well as purchase and resale spreads. Obtain written terms rather than treating the spot price as the full ownership cost. Source: <https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/Metals10Things.html> (opened 2026-10-12).

- **Exchange-traded exposure**: Metal-related exchange-traded products can provide price exposure without personal storage, but their legal structure, holdings, fees and redemption rules differ. A futures-based product and a physically backed product should not be described as equivalent. Source: <https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/Metals10Things.html>; <https://www.cmegroup.com/markets/metals/precious/gold.contractSpecs.html> (opened 2026-10-12).

- **Mining-company shares**: A mining-company share is an equity interest in a business; it is not direct ownership of a specified amount of bullion. Company operating and financing risks require separate research through filings. Source: <https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks> (opened 2026-10-12).

- **Mint reference**: The US Mint’s collectibles and investment-coin material distinguishes coin programs and formats. Use the issuer’s specifications to establish the exact product rather than assuming every gold-coloured or silver-coloured coin is bullion. Source: <https://www.usmint.gov/learn/coins-and-medals/collectible-coins> (opened 2026-10-12).

### How to trade

- **Educational futures workflow**: Teach contract unit, tick value, margin, expiry and delivery obligations before showing an order example. A classroom exercise should use fictional cash and clearly labelled hypothetical prices; margin is not the same as paying the full contract value. Source: <https://www.cmegroup.com/rulebook/COMEX/1a/113.pdf>; <https://www.cmegroup.com/rulebook/COMEX/1a/112.pdf>; <https://www.cmegroup.com/markets/metals/precious/gold.contractSpecs.html> (opened 2026-10-12).

- **Price-series labels**: Use separate labels for spot, futures contract month, benchmark and retail quote. Benchmark data access and redistribution can require a licence, so an educational page should not imply freely reusable live LBMA data. Source: <https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices> (opened 2026-10-12).

### Where to trade

- **Dealer checks**: Check the dealer’s legal identity and any relevant registration, request a written buyback quote and all charges, and verify the storage provider independently. A business reputation listing is not proof of authorisation for a particular regulated service. Source: <https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/Metals10Things.html> (opened 2026-10-12).

- **BBB and assay — hold for sourcing**: UNVERIFIED: a direct BBB source establishing its role and a retail assay/testing reference were not opened. Do not display “BBB approved” as a regulator endorsement or describe an unverified home test as conclusive. Source: <https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/Metals10Things.html> (opened 2026-10-12).

- **Tax pointers**: Use the national tax-authority pointers in Crypto’s How-to guides as starting points, with asset-specific research for bullion, coins, funds and futures. UNVERIFIED: country-specific metal tax rates, VAT/GST exemptions, collectibles treatment and holding-period relief; no tax conclusion is supplied here. Source attempted: <https://www.irs.gov/> (attempted 2026-10-12).

### History

- **Bretton Woods**: The 1944 Bretton Woods conference established a monetary framework linking currencies to the dollar and the dollar to gold, alongside the IMF and World Bank arrangements. Distinguish that system from earlier domestic gold-standard arrangements. Source: <https://www.federalreservehistory.org/essays/bretton-woods-created> (opened 2026-10-12).

- **1971 Nixon shock**: On 1971-08-15, President Nixon announced suspension of dollar convertibility into gold along with other economic measures. This was a central break in the Bretton Woods arrangement, rather than the date every country stopped using every form of gold linkage. Source: <https://www.federalreservehistory.org/essays/gold-convertibility-ends> (opened 2026-10-12).

- **1980, 2011 and 2020 comparisons**: WGC’s 2020 record-price discussion compares the rally with 2011 and the inflation-adjusted 1980 peak. Exact peak amounts/dates are UNVERIFIED for a consistent spot, fixing or futures series; do not mix an intraday high with a daily benchmark. Source: <https://www.gold.org/goldhub/research/investment-update-gold-hits-record-high-sprint-or-marathon> (opened 2026-10-12).

- **Gold standard and Hunt brothers — research hold**: UNVERIFIED: the requested early gold-standard chronology and the 1980 Hunt brothers silver episode need dedicated primary archival/court sources. No unsourced dates, position sizes or loss figures are supplied. Source: <https://www.federalreservehistory.org/essays/bretton-woods-created> (opened 2026-10-12).

### Risks

- **Costs, counterfeit and custody**: Precious-metal fraud can involve inflated spreads or storage charges for metal that was never purchased. Independently verify what is owned, where it is held and what insurance actually covers. Source: <https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/Metals10Things.html> (opened 2026-10-12).

- **Leverage and product mismatch**: Futures require attention to expiry and settlement; exchange-traded exposure may have fees and a structure that behaves differently from physical ownership. UNVERIFIED: fund-specific tracking-error figures and any universal claim that gold protects against all inflation. Source: <https://www.cmegroup.com/rulebook/COMEX/1a/113.pdf>; <https://www.cmegroup.com/markets/metals/precious/gold.contractSpecs.html> (opened 2026-10-12).

## Hub 3: Stocks

### Learn the basics

- **Shares**: A stock represents an ownership interest in a company; returns can include price changes and dividends. Ownership does not guarantee a dividend or protection against loss. Source: <https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks> (opened 2026-10-12).

- **Indexes and the S&P 500**: S&P Dow Jones Indices publishes eligibility and maintenance rules for its US indexes, including float adjustment, liquidity and financial criteria. The S&P 500 is not simply an automatic list of whichever 500 stocks happen to be largest that day. Source: <https://www.spglobal.com/spdji/en/documents/methodologies/methodology-sp-us-indices.pdf> (opened 2026-10-12).

- **ETFs, dividends and splits**: Use the SEC’s investment-product material to distinguish a fund share from an individual company share, and cash distributions from changes in share count. UNVERIFIED in this pack: a dedicated split example and product-specific ETF creation/redemption details. Source: <https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks>; <https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders> (opened 2026-10-12).

### How markets work

- **Exchange hours**: NYSE’s core session is 09:30–16:00 Eastern time on normal trading days; its official calendar identifies holidays and early closes. Other exchanges, venues and extended sessions need their own schedules. Source: <https://www.nyse.com/trade/hours-calendars> (opened 2026-10-12).

- **US T+1 settlement**: The SEC’s bulletin explains the move to settlement one business day after the trade date for most covered US securities transactions, effective 2024-05-28. Execution and settlement are different events; weekends and market holidays matter. Source: <https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/new-t1-settlement-cycle-what-investors-need-know-investor-bulletin> (opened 2026-10-12).

- **Market, limit and stop orders**: A market order prioritises execution without fixing the execution price; a limit order sets a price boundary but may not execute. A stop order becomes a market order when triggered and therefore does not guarantee the stop price. Source: <https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders> (opened 2026-10-12).

- **FINRA margin-rule change**: FINRA Notice 26-10, published 2026-04-20, replaces the old day-trading margin regime with intraday standards, effective 2026-06-04, with a firm implementation phase-in ending 2027-10-20. During that transition, do not state that the old $25,000 pattern-day-trader requirement universally applies—or universally disappeared—without checking the broker’s implementation. Source: <https://www.finra.org/rules-guidance/notices/26-10>; <https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210> (opened 2026-10-12).

### Reading a company

- **Find original filings**: EDGAR’s search allows readers to find company filings and filter by form and date. Proposed classroom exercise: compare the same company’s annual, quarterly, current-event and proxy filings; exact form explanations should be checked against SEC form instructions before publication. Source: <https://www.sec.gov/edgar/search/> (opened 2026-10-12).

- **Financial statements**: A balance sheet presents assets, liabilities and equity at a point in time; the income statement measures revenue and expenses over a period. A cash-flow statement explains cash movement, which is not interchangeable with accounting profit. Source: <https://www.sec.gov/investor/pubs/begfinstmtguide.htm> (opened 2026-10-12).

- **Notes and management discussion**: Read footnotes and management’s discussion alongside headline figures to understand accounting choices, risks and context. Ratios lose meaning when compared across incompatible periods or business models. Source: <https://www.sec.gov/investor/pubs/begfinstmtguide.htm> (opened 2026-10-12).

- **Basic ratios**: Debt-to-equity compares liabilities with equity; operating margin compares operating income with revenue, and P/E compares share price with earnings per share. Check which numerator, denominator and reporting period the source uses, particularly where earnings are negative. Source: <https://www.sec.gov/investor/pubs/begfinstmtguide.htm> (opened 2026-10-12).

### How to trade

- **A classroom order exercise**: Use a fictional ticker to compare a market order with a price-limited order, then explain a partial fill and a non-fill. This teaches execution mechanics without opening a brokerage account or placing a real trade. Source: <https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders> (opened 2026-10-12).

- **Cash and margin**: FINRA Rule 4210 is the primary reference for its margin framework; house requirements and implementation details also matter. Borrowing introduces collateral and liquidation risks, so classroom examples must not present buying power as free money. Source: <https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210> (opened 2026-10-12).

- **Short selling — sourcing hold**: UNVERIFIED: a dedicated SEC short-sale mechanics page was not opened in this review. Do not publish detailed borrowing, locate, recall or loss-limit claims until that source is added. Source: <https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders> (opened 2026-10-12).

### Brokers and where to trade

- **United States — BrokerCheck**: FINRA explains that BrokerCheck provides registration and background information about brokers and firms. Search the exact legal name and review disclosures; a profile is not a recommendation. Source: <https://www.finra.org/investors/investing/working-with-investment-professional/about-brokercheck>; <https://brokercheck.finra.org/> (opened 2026-10-12).

- **SIPC limits**: SIPC explains protection for missing customer cash and securities at a financially troubled member broker, up to $500,000 including a $250,000 cash limit. It does not insure market declines or promise that every asset or account arrangement qualifies. Source: <https://www.sipc.org/for-investors/what-sipc-protects> (opened 2026-10-12).

- **Canada**: CSA directs readers to National Registration Search, disciplinary records and their provincial or territorial regulator. Check registration category and conditions rather than treating registration as a product recommendation. Source: <https://www.securities-administrators.ca/investor-tools/are-they-registered/> (opened 2026-10-12).

- **Australia**: ASIC’s Moneysmart provides a check-before-investing guide with licensing and scam checks. Match the business identity and permitted activity, including contact details, rather than relying on a logo or claimed licence. Source: <https://moneysmart.gov.au/check-and-report-scams/check-before-you-invest> (opened 2026-10-12).

- **Japan**: FSA publishes lists of licensed or registered financial institutions by category. Use the relevant securities-business category; a crypto registration is not a substitute for securities permissions. Source: <https://www.fsa.go.jp/en/regulated/licensed/index.html> (opened 2026-10-12).

- **India**: SEBI’s intermediaries page is the official entry point for market-intermediary categories. Individual broker status, registration number and any investor-compensation rules are UNVERIFIED in this pack. Source: <https://www.sebi.gov.in/intermediaries.html> (opened 2026-10-12).

- **United Kingdom and Germany**: UNVERIFIED retrieval: the attempted FCA consumer-check page and BaFin company-database page could not be read. No current broker names or compensation limits are asserted for either country. Source attempted: <https://www.fca.org.uk/consumers/check-financial-services-firm>; <https://www.bafin.de/EN/PublikationenDaten/Datenbanken/Unternehmenssuche/unternehmenssuche_node_en.html> (attempted 2026-10-12).

### Charting

- **TradingView documentation**: TradingView’s own Chart Questions help centre is a first-party reference for its chart features. Use public documentation for interface explanations; do not treat community trading ideas as verified forecasts or imply the full product is free or account-free. Source: <https://www.tradingview.com/support/categories/chart/> (opened 2026-10-12).

- **Reading a chart before interpreting it**: RBA’s public worksheet asks learners to work with chart interpretation. Proposed lesson checklist: identify the series, units, interval, axes and source before drawing a conclusion; include a discussion of price returns versus total returns. Source: <https://www.rba.gov.au/education/teacher-materials/learning-activities/> (opened 2026-10-12).

- **Investor.gov practice**: The SEC publishes public investing quizzes and calculators suitable for checking financial concepts. These are educational tools from the regulator, not technical-analysis signals. Source: <https://www.investor.gov/additional-resources/spotlight/investing-quizzes>; <https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator> (opened 2026-10-12).

### History

- **1792 Buttonwood Agreement**: NYSE traces its origins to the Buttonwood Agreement signed on 1792-05-17. Explain this as an institutional origin, not the invention of stock trading worldwide. Source: <https://www.nyse.com/history-of-nyse> (opened 2026-10-12).

- **1929 crash**: Federal Reserve History discusses the October 1929 stock-market crash and its monetary context. Avoid reducing the entire Great Depression to a single day’s stock-price fall. Source: <https://www.federalreservehistory.org/essays/stock-market-crash-of-1929> (opened 2026-10-12).

- **1987 crash**: On 1987-10-19, US stocks suffered the crash commonly called Black Monday; Federal Reserve History examines market mechanisms and the policy response. It is useful for distinguishing liquidity stress from a simple story about one news headline. Source: <https://www.federalreservehistory.org/essays/stock-market-crash-of-1987> (opened 2026-10-12).

- **2000 dot-com episode**: UNVERIFIED: a dedicated primary source for the dot-com peak, decline and relevant index series was not opened. Keep precise dates and percentage drawdowns on hold. Source: <https://www.nyse.com/history-of-nyse> (opened 2026-10-12).

- **2008 financial crisis**: Federal Reserve History traces the Great Recession and its aftermath, including financial-system stress and policy responses. Separate the recession’s dating from individual bank failures and stock-market turning points. Source: <https://www.federalreservehistory.org/essays/great-recession-and-its-aftermath> (opened 2026-10-12).

- **2020 pandemic response**: On 2020-03-15, the FOMC lowered its target range to 0–0.25% and announced additional support measures as the pandemic disrupted economic activity. That policy date is not a verified date for an equity-market bottom. Source: <https://www.federalreserve.gov/newsevents/pressreleases/monetary20200315a.htm> (opened 2026-10-12).

### Risks

- **Ownership and losses**: Company shares can lose value, and dividends are not assured. Diversification and careful research do not transform equities into insured deposits. Source: <https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks> (opened 2026-10-12).

- **Orders are not price guarantees**: A stop order’s trigger is not a guaranteed sale price, and a limit order can remain unfilled. Show these trade-offs in the educational example rather than advertising either as loss prevention. Source: <https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders> (opened 2026-10-12).

- **Protection has a specific scope**: SIPC protection concerns certain missing customer property at member firms; it does not compensate a poor investment decision or general market losses. Source: <https://www.sipc.org/for-investors/what-sipc-protects> (opened 2026-10-12).

## Hub 4: Global politics & markets

### How it fits together

- **Worked example: an unexpected rate rise**: Illustrative scenario: higher domestic rates relative to overseas rates can support the currency; higher yields reduce existing fixed-rate bond prices. Equities may face higher discount rates, but earnings expectations and what markets already anticipated can change the outcome. Source: <https://www.rba.gov.au/education/resources/explainers/the-transmission-of-monetary-policy.html>; <https://www.rba.gov.au/education/resources/explainers/bonds-and-the-yield-curve.html> (opened 2026-10-12).

- **Worked example: an oil supply disruption**: Illustrative scenario: restricted supply raises energy costs, potentially lifting inflation while squeezing household purchasing power and business margins. A central bank weighs persistence and expectations; a rate increase is not an automatic consequence of every oil-price move. Source: <https://www.rba.gov.au/education/resources/explainers/causes-of-inflation.html> (opened 2026-10-12).

- **Worked example: tariffs and sanctions**: Illustrative scenario for classroom discussion: a new trade restriction changes an importer’s costs and prompts sourcing changes; currency effects depend on the broader response. UNVERIFIED: no specific tariff or sanctions instrument was checked, so do not publish a country-specific causal claim from this example. Source: <https://www.rba.gov.au/education/resources/explainers/exchange-rates-and-the-australian-economy.html> (opened 2026-10-12).

- **Worked example: sovereign credit concerns**: Illustrative scenario: investors demand a higher yield for perceived repayment risk, reducing an existing bond’s market value. Currency, funding and equity effects depend on the issuer and conditions; a rating change is not itself proof of default. Source: <https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds> (opened 2026-10-12).

### Central banks

- **Federal Reserve**: US statutory objectives include maximum employment, stable prices and moderate long-term interest rates. Use the FOMC calendar for decisions and minutes. Source: <https://www.federalreserve.gov/aboutthefed/section2a.htm>; <https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm> (opened 2026-10-12).

- **European Central Bank**: The Eurosystem’s primary objective is price stability. Distinguish monetary-policy meetings from other Governing Council meetings in its calendar. Source: <https://www.ecb.europa.eu/ecb/orga/tasks/html/index.en.html>; <https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html> (opened 2026-10-12).

- **Bank of England**: Bank Rate is a principal monetary-policy instrument; explain its transmission using the Bank’s own account. The MPC calendar supplies scheduled decision dates. Source: <https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate>; <https://www.bankofengland.co.uk/monetary-policy/upcoming-mpc-dates> (opened 2026-10-12).

- **Bank of Japan**: Its monetary-policy overview explains the price-stability objective. The meeting page provides schedules, summaries and minutes. Source: <https://www.boj.or.jp/en/mopo/outline/index.htm>; <https://www.boj.or.jp/en/mopo/mpmsche_minu/index.htm> (opened 2026-10-12).

- **Swiss National Bank**: The SNB seeks price stability while taking economic developments into account. Its policy-decision archive is verified; a separate future calendar remains UNVERIFIED. Source: <https://www.snb.ch/en/the-snb/mandates-goals>; <https://www.snb.ch/en/the-snb/mandates-goals/monetary-policy/decisions> (opened 2026-10-12).

- **Reserve Bank of Australia**: The monetary-policy overview explains price stability and full employment. Use the Monetary Policy Board schedule, rather than assuming the historical meeting pattern continues. Source: <https://www.rba.gov.au/monetary-policy/>; <https://www.rba.gov.au/schedules-events/board-meeting-schedules.html> (opened 2026-10-12).

- **Bank of Canada**: The Bank explains its inflation-control framework and publishes policy announcement dates. The linked schedule is specifically for 2026 and needs replacement for later years. Source: <https://www.bankofcanada.ca/core-functions/monetary-policy/>; <https://www.bankofcanada.ca/2025/08/bank-canada-publishes-2026-schedule-policy-interest-rate-announcements-other-major-publications/> (opened 2026-10-12).

- **People’s Bank of China**: UNVERIFIED: the attempted English monetary-policy page could not be retrieved; mandate wording, announcement links and calendar require confirmation. Source attempted: <https://www.pbc.gov.cn/en/3688229/3688299/index.html> (attempted 2026-10-12).

- **Reserve Bank of India**: UNVERIFIED: the attempted monetary-policy page could not be retrieved; confirm the current framework and MPC calendar before publication. Source attempted: <https://www.rbi.org.in/Scripts/MonetaryPolicy.aspx> (attempted 2026-10-12).

### Currencies

- **Exchange rates and the economy**: An exchange rate changes the domestic-currency cost of imports and the competitiveness of exports. Relative interest rates, expectations and economic conditions interact, so a single headline is not a dependable currency forecast. Source: <https://www.rba.gov.au/education/resources/explainers/exchange-rates-and-the-australian-economy.html> (opened 2026-10-12).

### Rates and bonds

- **Price, yield and maturity**: Distinguish a bond’s coupon from its market yield, and show the inverse price–yield relationship for a fixed-rate bond. A yield curve compares yields across maturities; it is a market snapshot, not a guaranteed forecast. Source: <https://www.rba.gov.au/education/resources/explainers/bonds-and-the-yield-curve.html> (opened 2026-10-12).

### Trade and geopolitics

- **IMF**: The IMF supports international monetary cooperation through surveillance, financing and capacity development; its role differs from a commercial bank’s. Source: <https://www.imf.org/en/About> (opened 2026-10-12).

- **World Bank**: The World Bank’s development mission centers on reducing poverty on a livable planet. Label development lending separately from central-bank monetary policy. Source: <https://www.worldbank.org/ext/en/who-we-are> (opened 2026-10-12).

- **BIS**: The BIS supports central-bank cooperation and provides research and banking services for central banks. It does not set a single world policy interest rate. Source: <https://www.bis.org/about> (opened 2026-10-12).

- **OECD**: The OECD produces comparative policy analysis, standards and data. Treat its publications as dated institutional analysis rather than binding domestic law. Source: <https://www.oecd.org/en/about.html> (opened 2026-10-12).

- **WTO, G7 and G20**: UNVERIFIED: the attempted introductory pages were unavailable; obtain functioning institutional sources before publishing membership, remit or summit-calendar claims. Source attempted: <https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm>; <https://www.g7.utoronto.ca/what_is_g7.html>; <https://g20.org/about-g20/> (attempted 2026-10-12).

### Commodities and energy

- **OPEC**: OPEC describes its mission as coordinating member petroleum policies and supporting oil-market stability. Do not equate a stated policy goal with a guaranteed oil price. Source: <https://www.opec.org/our-mission.html> (opened 2026-10-12).

- **Energy outlooks**: The US EIA Short-Term Energy Outlook supplies dated energy analysis and forecasts. Label forecasts and revisions explicitly, rather than displaying them as observed production or prices. Source: <https://www.eia.gov/outlooks/steo/> (opened 2026-10-12).

### Key data and calendar

- **US labor and inflation**: BLS publishes its release schedule; link the relevant release and reference period alongside any quoted figure. Source: <https://www.bls.gov/schedule/news_release/> (opened 2026-10-12).

- **US national accounts**: BEA publishes release dates for economic statistics. Distinguish advance estimates from subsequent revisions. Source: <https://www.bea.gov/news/schedule> (opened 2026-10-12).

- **European statistics**: Eurostat supplies an official release calendar; distinguish EU and euro-area coverage. Source: <https://ec.europa.eu/eurostat/news/release-calendar> (opened 2026-10-12).

- **UK statistics**: ONS supplies a release calendar. Show the geographic coverage and reference period rather than treating every release as UK-wide and current-month. Source: <https://www.ons.gov.uk/releasecalendar> (opened 2026-10-12).

- **China statistics**: The National Bureau of Statistics English press-release page is a primary release source. A complete forward calendar and translation lag were not verified. Source: <https://www.stats.gov.cn/english/PressRelease/> (opened 2026-10-12).

### History

- **1944 Bretton Woods**: Explain the postwar monetary arrangements and institutions agreed at Bretton Woods, distinguishing the agreement from later implementation. Source: <https://www.federalreservehistory.org/essays/bretton-woods-created> (opened 2026-10-12).

- **1971 gold convertibility**: Nixon ended dollar convertibility into gold for foreign official holders in August 1971; distinguish that action from every subsequent exchange-rate reform. Source: <https://www.federalreservehistory.org/essays/gold-convertibility-ends> (opened 2026-10-12).

- **1999 euro**: The euro began in 1999; distinguish its initial monetary and accounting use from the later arrival of notes and coins. Source: <https://www.ecb.europa.eu/ecb/history-arts-culture/history/html/index.en.html> (opened 2026-10-12).

- **2008 crisis**: Use the Federal Reserve’s historical account to explain financial stress, recession and policy responses without assigning every event the same date. Source: <https://www.federalreservehistory.org/essays/great-recession-and-its-aftermath> (opened 2026-10-12).

- **2012 euro-area policy response**: The ECB announced technical features of Outright Monetary Transactions on 2012-09-06, including conditionality. This source supports that policy event, not a full chronology of the sovereign-debt crisis. Source: <https://www.ecb.europa.eu/press/pr/date/2012/html/pr120906_1.en.html> (opened 2026-10-12).

- **2020 pandemic**: The FOMC’s 2020-03-15 statement records emergency monetary easing during pandemic disruption. Source: <https://www.federalreserve.gov/newsevents/pressreleases/monetary20200315a.htm> (opened 2026-10-12).

- **2022 inflation and tightening**: The FOMC raised its target range on 2022-03-16 and discussed inflation and the economic uncertainty associated with Russia’s invasion of Ukraine. Source: <https://www.federalreserve.gov/newsevents/pressreleases/monetary20220316a.htm> (opened 2026-10-12).

- **1985 Plaza Accord and 1997 Asian financial crisis**: UNVERIFIED: attempted historical sources could not be opened. Hold precise dates, participants and causal summaries until accessible primary accounts are checked. Source attempted: <https://www.elibrary.imf.org/display/book/9781557759719/ch004.xml>; <https://www.federalreservehistory.org/essays/asian-financial-crisis> (attempted 2026-10-12).

## Hub 5: Education — separate Learn hub

All learning sequences and classroom adaptations below are editorial proposals, not accredited courses or claimed standards alignments. Public pages and downloadable materials are eligible; membership courses, registration-based competitions and unverified app installs are not active Learn recommendations.

### Middle school (about ages 11–14)

#### What to learn

- **Suggested sequence**: 1. Needs, wants and choices → 2. Money and exchange → 3. Earning and human capital → 4. Saving toward a goal → 5. Spending plans → 6. Simple interest and compounding → 7. Borrowing and repayment → 8. Risk and basic diversification → 9. Markets, supply and demand → 10. Inflation and the wider economy. This is an editorial teaching sequence informed by the linked curriculum, not a claim that its publisher endorses Market Files. Source: <https://www.federalreserveeducation.org/teaching-resources/economics/curriculum/fref-middle-school> (opened 2026-10-12).

#### Free reputable materials

- **Federal Reserve Education: middle-school curriculum**: Public lesson summaries and linked teaching materials from the Federal Reserve education network cover decisions, markets and money. Use public materials only; account-gated teacher answer keys are excluded. Source: <https://www.federalreserveeducation.org/teaching-resources/economics/curriculum/fref-middle-school> (opened 2026-10-12).

- **Bank of England: EconoME**: The central bank lists free classroom resources for ages 11–16, including EconoME. The publisher is a primary source for its own educational materials; teachers should adapt UK examples to their learners. Source: <https://www.bankofengland.co.uk/education/education-resources> (opened 2026-10-12).

#### Study aids

- **Vocabulary cards made in class**: Use the CFPB public glossary to make teacher-created question-and-answer cards for terms such as interest, saving and risk. These are an adaptation, not an official CFPB flashcard product. Source: <https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/glossary/> (opened 2026-10-12).

#### Teacher/parent notes

- **Standards and classroom use**: Jump$tart and CEE’s published national standards provide a reference for mapping lessons to grade-level expectations. Market Files has not completed a formal alignment; use fictional budgets and never ask pupils to disclose family finances. Source: <https://www.jumpstart.org/wp-content/uploads/2023/04/2021_Natl_Standards_Downloadable_final.pdf> (opened 2026-10-12).

### High school (14–18)

#### What to learn

- **Suggested sequence**: 1. Goals and decision-making → 2. Income and taxes → 3. Budgets and net worth → 4. Saving and compound interest → 5. Credit and borrowing costs → 6. Insurance and fraud awareness → 7. Stocks, bonds and diversification → 8. Markets and institutions → 9. Inflation, employment and GDP → 10. Comparing financial claims and evidence. This is an editorial teaching sequence informed by the linked curriculum, not a claim that its publisher endorses Market Files. Source: <https://www.federalreserveeducation.org/teaching-resources/personal-finance/curriculum/making-personal-finance-decisions-curriculum> (opened 2026-10-12).

#### Free reputable materials

- **Federal Reserve Education: Making Personal Finance Decisions**: The public curriculum overview describes 20 lessons across ten personal-finance concepts. The overview was opened; individual downloadable lesson access should be checked before adding direct lesson buttons. Source: <https://www.federalreserveeducation.org/teaching-resources/personal-finance/curriculum/making-personal-finance-decisions-curriculum> (opened 2026-10-12).

- **CFPB youth activities**: The public activity directory provides grade filters and teacher/student materials from the US consumer-finance regulator. Select age-appropriate activities without requiring student accounts. Source: <https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/teach/activities/> (opened 2026-10-12).

#### Study aids

- **SEC quizzes and compound-interest calculator**: Investor.gov offers public quizzes and a calculator for hypothetical saving examples. Ask students to explain assumptions and compare outcomes; no real account or investment is needed. Source: <https://www.investor.gov/additional-resources/spotlight/investing-quizzes>; <https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator> (opened 2026-10-12).

#### Teacher/parent notes

- **Standards and classroom use**: Jump$tart and CEE’s published national standards provide a reference for mapping lessons to grade-level expectations. Market Files has not completed a formal alignment; use fictional budgets and never ask pupils to disclose family finances. Source: <https://www.jumpstart.org/wp-content/uploads/2023/04/2021_Natl_Standards_Downloadable_final.pdf> (opened 2026-10-12).

### College

#### What to learn

- **Suggested sequence**: 1. Time value of money → 2. Financial statements and cash flows → 3. Risk and expected return → 4. Stocks and bonds → 5. Portfolio diversification → 6. Market institutions and incentives → 7. Insurance and banking → 8. Behavioral finance → 9. Financial crises and public policy → 10. Ethics and evidence-based analysis. This is an editorial teaching sequence informed by the linked curriculum, not a claim that its publisher endorses Market Files. Source: <https://oyc.yale.edu/economics/econ-252> (opened 2026-10-12).

#### Free reputable materials

- **Open Yale Courses: Financial Markets**: Yale’s public 2011 Robert Shiller course offers a university-level introduction to financial institutions and risk. Historical lectures need current-law context; assigned commercial books are not included as free materials. Source: <https://oyc.yale.edu/economics/econ-252> (opened 2026-10-12).

- **RBA learning activities**: The Australian central bank publishes worksheets and teaching activities on economic indicators and monetary-policy transmission. These support interpreting data and explaining mechanisms rather than predicting trades. Source: <https://www.rba.gov.au/education/teacher-materials/learning-activities/> (opened 2026-10-12).

#### Study aids

- **MIT problem-set directory**: The public directory lists finance problem sets and solutions, including present value, fixed income and common stock. Individual PDFs were not all opened, so verify the chosen download before publishing a direct practice link. Source: <https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/pages/problem-sets/> (opened 2026-10-12).

#### Teacher/parent notes

- **Use historical materials critically**: Pair the Yale lectures with dated primary-source releases and ask students to separate observation, forecast and interpretation. The course is a learning resource, not a current-law checklist. Source: <https://oyc.yale.edu/economics/econ-252> (opened 2026-10-12).

### Higher ed / professional

#### What to learn

- **Suggested sequence**: 1. Discounted cash-flow modeling → 2. Fixed-income valuation → 3. Equity valuation assumptions → 4. Portfolio theory → 5. CAPM and factor models → 6. Forwards and futures → 7. Options and contingent claims → 8. Capital budgeting → 9. Market efficiency and model limitations → 10. Professional ethics and conflicts. This is an editorial teaching sequence informed by the linked curriculum, not a claim that its publisher endorses Market Files. Source: <https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/> (opened 2026-10-12).

#### Free reputable materials

- **Federal Reserve Education: Making Personal Finance Decisions**: The public curriculum overview describes 20 lessons across ten personal-finance concepts. The overview was opened; individual downloadable lesson access should be checked before adding direct lesson buttons. Source: <https://www.federalreserveeducation.org/teaching-resources/personal-finance/curriculum/making-personal-finance-decisions-curriculum> (opened 2026-10-12).

- **CFPB youth activities**: The public activity directory provides grade filters and teacher/student materials from the US consumer-finance regulator. Select age-appropriate activities without requiring student accounts. Source: <https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/teach/activities/> (opened 2026-10-12).

#### Study aids

- **SEC quizzes and compound-interest calculator**: Investor.gov offers public quizzes and a calculator for hypothetical saving examples. Ask students to explain assumptions and compare outcomes; no real account or investment is needed. Source: <https://www.investor.gov/additional-resources/spotlight/investing-quizzes>; <https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator> (opened 2026-10-12).

#### Teacher/parent notes

- **Standards and classroom use**: Jump$tart and CEE’s published national standards provide a reference for mapping lessons to grade-level expectations. Market Files has not completed a formal alignment; use fictional budgets and never ask pupils to disclose family finances. Source: <https://www.jumpstart.org/wp-content/uploads/2023/04/2021_Natl_Standards_Downloadable_final.pdf> (opened 2026-10-12).

### Games and fun learning

- **Pieces of Paper — Federal Reserve Education**: Public printable classroom simulation of barter and money for middle-school learners, listed at 46–60 minutes. The opened PDF uses classroom activity rather than real-money trading, needs no online account, and has no download charge; printing supplies are separate. Source: <https://www.federalreserveeducation.org/teaching-resources/economics/money/pieces-of-paper>; <https://www.federalreserveeducation.org/resources/lessons/lesson--yen-to-trade-lesson-8.pdf> (opened 2026-10-12).

- **Saving and Spending Game — Federal Reserve Education**: Public printable card-based activity, publisher level K–5, using a fictional saving goal. It is suitable as a foundation or remediation activity rather than being relabeled a middle-school product; no real-money account, app installation or registration is needed for the opened PDF. Source: <https://www.federalreserveeducation.org/teaching-resources/personal-finance/saving/saving-and-spending-game>; <https://www.federalreserveeducation.org/resources/lessons/lesson--saving-and-spending-game.pdf> (opened 2026-10-12).

- **InvestQuest — hold pending interactive checks**: SIFMA’s public page describes a no-registration, virtual portfolio activity with three difficulty levels and an approximately 30–40 minute session. UNVERIFIED: the linked app returned only a JavaScript shell, so current playability, minimum age, full data handling and terms were not confirmed; do not add an active game button yet. Source: <https://www.stockmarketgame.org/>; <https://smgiq.org/> (opened 2026-10-12).

- **Mobile games — no verified selection**: Visa’s public page lists Financial Football for ages 11+ and iOS/Android availability. UNVERIFIED: current store availability, advertising, in-app purchases, account requirements and privacy terms were not checked, so no mobile app is approved for the Learn resource list. Source: <https://visa.practicalmoneyskills.com/en/resources/apps.html> (opened 2026-10-12).

- **Registered competitions — excluded by owner instruction**: SIFMA’s Stock Market Game and the Federal Reserve challenge competitions require registration, so they are excluded from the no-sign-up learning list. Their public information can inform teacher discussion, but Market Files should not display an enrollment call to action. Source: <https://www.stockmarketgame.org/>; <https://www.federalreserve.gov/aboutthefed/educational-tools/college-fed-challenge-overview.htm>; <https://www.newyorkfed.org/outreach-and-education/high-school/high-school-fed-challenge> (opened 2026-10-12).

- **Competition dates are not evergreen**: The 2026 College Fed Challenge registration and video deadlines have passed; the New York Fed page describes a 2026–27 high-school competition. Keep enrollment details off Learn under the owner rule, and recheck any future editorial mention against the current rulebook. Source: <https://www.federalreserve.gov/aboutthefed/educational-tools/college-fed-challenge-overview.htm>; <https://www.newyorkfed.org/medialibrary/media/outreach-and-education/high-school-fed-challenge-rule-book-2026-2027> (opened 2026-10-12).

- **Spaced practice**: The US Institute of Education Sciences practice guide rates spacing learning over time as supported by moderate evidence. Revisit earlier concepts across lessons instead of relying on a single long session. Source: <https://ies.ed.gov/ncee/wwc/PracticeGuide/1> (opened 2026-10-12).

- **Retrieval practice**: The same guide gives strong evidence to using quizzes to re-expose students to key content. Short, low-stakes recall questions can be part of a lesson rather than a public leaderboard. Source: <https://ies.ed.gov/ncee/wwc/PracticeGuide/1> (opened 2026-10-12).

- **Worked examples and explanation**: The guide supports alternating worked examples with problem solving and asking deep explanatory questions. Have students explain a fictional bond or budget calculation before changing its assumptions. Source: <https://ies.ed.gov/ncee/wwc/PracticeGuide/1> (opened 2026-10-12).

- **Role-play with a bounded purpose**: The Federal Reserve’s Pieces of Paper lesson provides a concrete barter-and-money classroom simulation. Its existence supports the activity design; it does not establish that every competitive trading game improves financial decision-making. Source: <https://www.federalreserveeducation.org/resources/lessons/lesson--yen-to-trade-lesson-8.pdf> (opened 2026-10-12).

### Safety and fairness checks

- **No real-money activity**: Learn’s selected printable exercises use fictional situations; Market Files should not connect lessons to brokerage execution, deposits or gambling. Do not add cash-prize leaderboards, loot boxes or real-money trading activities for minors. Source: <https://www.federalreserveeducation.org/resources/lessons/lesson--saving-and-spending-game.pdf> (opened 2026-10-12).

- **No membership, payment or mandatory account**: Use only public pages and printables reviewed here; exclude member-only refresher readings and account-based learning labs. Do not require a credit card or student profile to access Market Files learning materials. Source: <https://www.cfainstitute.org/insights/professional-learning/refresher-readings>; <https://www.cfainstitute.org/insights/professional-learning/ethics-resources/learning-lab> (opened 2026-10-12).

- **Public access does not mean zero data collection**: A publicly readable website may still use cookies and technical logs; SIFMA’s privacy policy discusses collection and analytics. Avoid promising anonymous or zero-tracking third-party use, and prefer printed classroom materials when student data exposure is a concern. Source: <https://www.stockmarketgame.org/privacy-policy.html> (opened 2026-10-12).

- **Fair assessment**: Use explanations, calculations and reflection as proposed classroom assessments rather than ranking pupils by short-term portfolio returns. Provide printable alternatives and fictional household examples; these are editorial safeguards, not claims of formal curriculum accreditation. Source: <https://www.jumpstart.org/wp-content/uploads/2023/04/2021_Natl_Standards_Downloadable_final.pdf> (opened 2026-10-12).

## UNVERIFIED and gaps

Publication rule: the items below are internal holds, not confirmed facts or active resource recommendations. All source attempts and source openings in this document occurred on 2026-10-12; a working landing page does not verify every linked service, legal status, lesson download or app.

- **Crypto service verification**: UNVERIFIED / HOLD: Wallet-specific independent audits, current incidents, detailed custody arrangements and local permissions remain incomplete where marked in Hub 1; do not infer them from a brand’s general website. Source: <https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/crypto-asset-custody-basics-retail-investors-investor-bulletin-0> (opened 2026-10-12).

- **Registers and exact legal entities**: UNVERIFIED / HOLD: Some registry landing pages were accessible but their searchable records or downloads were not; refresh entity-level status before publication. ESMA CSV retrieval, AUSTRAC interactive records, BaFin and AMF lookups, and the Brazil BCB rule interface need follow-up. Source: <https://www.esma.europa.eu/publications-and-data/databases-and-registers>; <https://online.apps.austrac.gov.au/vaspr> (opened 2026-10-12).

- **Tax treatment**: UNVERIFIED / HOLD: Jurisdiction-specific tax coverage is incomplete; directory links are not verified guidance for an individual transaction. Do not publish numerical thresholds, exemptions, rates or personal tax conclusions without current tax-authority support. Source: <https://www.irs.gov/filing/digital-assets> (opened 2026-10-12).

- **Historical gaps**: UNVERIFIED / HOLD: Quadriga primary materials, precise Mt. Gox chronology and current recoveries, metals price peaks and the Hunt episode, and a dedicated dot-com history source remain incomplete. Do not infer current appeals, repayments or loss totals from historical enforcement announcements. Source: <https://www.federalreservehistory.org/essays/great-recession-and-its-aftermath> (opened 2026-10-12).

- **Global coverage**: UNVERIFIED / HOLD: PBoC and RBI mandate/calendar retrieval failed; WTO, G7/G20 introductions, Plaza Accord and Asian-crisis sources need replacement. A full euro-area crisis chronology and specific tariff/sanctions legal examples were not established. Source: <https://www.pbc.gov.cn/en/3688229/3688299/index.html>; <https://www.rbi.org.in/Scripts/MonetaryPolicy.aspx> (opened 2026-10-12).

- **Learning materials not fully exercised**: UNVERIFIED / HOLD: Not every curriculum PDF, solution download or interactive calculator was tested end-to-end. Public course pages do not make all assigned books free, and no course listed here confers a credential. Source: <https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/>; <https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/pages/problem-sets/> (opened 2026-10-12).

- **Simulator and mobile holds**: UNVERIFIED / HOLD: InvestQuest runtime/terms, FDIC’s interactive game, and Financial Football app-store/privacy/payment details remain UNVERIFIED. No mobile app or live web simulator has passed the full requested eligibility check. Source: <https://smgiq.org/>; <https://playmoneysmart.fdic.gov/>; <https://visa.practicalmoneyskills.com/en/resources/apps.html> (opened 2026-10-12).

- **FDIC, Khan Academy and card-game retrieval**: UNVERIFIED / HOLD: The attempted FDIC curriculum pages were inaccessible, Khan Academy’s financial-literacy page yielded no usable content, and the central-banking card-game PDF failed. These are not included as verified no-account resources. Source: <https://www.fdic.gov/consumer-resource-center/money-smart-young-people>; <https://www.khanacademy.org/college-careers-more/financial-literacy>; <https://www.federalreserveeducation.org/resources/lessons/lesson--central-banking-card-game.pdf> (opened 2026-10-12).

- **Account-based resources intentionally excluded**: UNVERIFIED / HOLD: CFA’s learning lab requires an account and refresher readings are member-only; registered competitions are excluded under the owner’s instruction. This is a scope decision rather than a claim that those programs are unsafe. Source: <https://www.cfainstitute.org/insights/professional-learning/ethics-resources/learning-lab>; <https://www.cfainstitute.org/insights/professional-learning/refresher-readings> (opened 2026-10-12).

Handoff boundary: this file is research for Claude to review and implement selectively. It does not claim that the website was updated, that every requested fact was verified, or that any GitHub or Vercel action occurred.
