import { QuizQuestion } from '../types/quiz';

export const CELLULAR_RESPIRATION_QUESTIONS: QuizQuestion[] = [
  {
    id: 'bio_q1',
    question: 'Where does glycolysis take place in the cell, and what are its oxygen requirements?',
    options: [
      'In the cytoplasm, and it does not require oxygen (anaerobic)',
      'In the mitochondrial matrix, and it requires aerobic conditions',
      'On the inner mitochondrial cristae, requiring molecular oxygen',
      'Inside the endoplasmic reticulum, requiring anaerobic conditions'
    ],
    correctOptionIndex: 0,
    topic: 'Glycolysis',
    sourceContext: 'Glycolysis takes place directly in the cell cytoplasm and does not require oxygen (anaerobic).',
    explanation: 'According to the notes, glycolysis takes place directly in the cell cytoplasm and is anaerobic, meaning it proceeds without oxygen.'
  },
  {
    id: 'bio_q2',
    question: 'What is the net energy yield produced per glucose molecule during glycolysis?',
    options: [
      'Net gain of 2 ATP and 2 NADH',
      'Net gain of 4 ATP and 4 FADH2',
      'Net gain of 30 ATP and 6 CO2',
      'Net gain of 1 ATP and 2 pyruvate'
    ],
    correctOptionIndex: 0,
    topic: 'Glycolysis',
    sourceContext: 'Glycolysis requires an initial investment of 2 ATP molecules and produces 4 ATP molecules... yielding a net gain of 2 ATP and 2 NADH.',
    explanation: 'The notes state that an initial investment of 2 ATP produces 4 ATP, resulting in a net yield of 2 ATP and 2 NADH.'
  },
  {
    id: 'bio_q3',
    question: 'Which key rate-limiting enzyme regulates glycolysis and is inhibited by high levels of ATP?',
    options: [
      'Phosphofructokinase (PFK)',
      'ATP Synthase',
      'Pyruvate Dehydrogenase',
      'Citrate Synthase'
    ],
    correctOptionIndex: 0,
    topic: 'Glycolysis Regulation',
    sourceContext: 'Phosphofructokinase (PFK) acts as the key rate-limiting enzyme in glycolysis, inhibited by high levels of ATP.',
    explanation: 'The notes identify Phosphofructokinase (PFK) as the primary rate-limiting enzyme modulated by cellular ATP levels.'
  },
  {
    id: 'bio_q4',
    question: 'During pyruvate oxidation (the link reaction), what is pyruvate converted into?',
    options: [
      'Acetyl-CoA, releasing CO2 and producing NADH',
      'Oxaloacetate, releasing water and consuming ATP',
      'Lactic acid, consuming NADH and regenerating NAD+',
      'Citrate, releasing FADH2 and consuming CO2'
    ],
    correctOptionIndex: 0,
    topic: 'Pyruvate Oxidation',
    sourceContext: 'Each 3-carbon pyruvate molecule is converted into a 2-carbon acetyl group attached to Coenzyme A, forming Acetyl-CoA. One CO2 is released...',
    explanation: 'Pyruvate oxidation converts each 3-carbon pyruvate into Acetyl-CoA while releasing CO2 and reducing NAD+ to NADH in the mitochondrial matrix.'
  },
  {
    id: 'bio_q5',
    question: 'In the Citric Acid Cycle (Krebs Cycle), what molecule combines with Acetyl-CoA (2C) to form citrate (6C)?',
    options: [
      'Oxaloacetate (4C)',
      'Pyruvate (3C)',
      'Succinate (4C)',
      'Alpha-ketoglutarate (5C)'
    ],
    correctOptionIndex: 0,
    topic: 'Krebs Cycle',
    sourceContext: 'Acetyl-CoA (2C) combines with oxaloacetate (4C) to form citrate (6C).',
    explanation: 'As described in the notes, the entry step of the Krebs cycle combines Acetyl-CoA (2C) with oxaloacetate (4C) to produce citrate (6C).'
  },
  {
    id: 'bio_q6',
    question: 'What is the theoretical yield produced by two turns of the Citric Acid Cycle per glucose molecule?',
    options: [
      '2 ATP (or GTP), 6 NADH, 2 FADH2, and 4 CO2',
      '4 ATP, 2 NADH, 6 FADH2, and 2 CO2',
      '1 ATP, 3 NADH, 1 FADH2, and 2 CO2',
      '26 to 28 ATP and 12 H2O'
    ],
    correctOptionIndex: 0,
    topic: 'Krebs Cycle',
    sourceContext: 'Yield per Glucose (two turns): Produces 2 ATP (or GTP), 6 NADH, 2 FADH2, and releases 4 molecules of CO2 as waste.',
    explanation: 'Two complete turns of the citric acid cycle yield 2 ATP (or GTP), 6 NADH, 2 FADH2, and release 4 CO2 molecules.'
  },
  {
    id: 'bio_q7',
    question: 'What serves as the terminal electron acceptor in the electron transport chain (ETC)?',
    options: [
      'Molecular oxygen (O2)',
      'Carbon dioxide (CO2)',
      'NAD+ molecules',
      'Cytochrome c'
    ],
    correctOptionIndex: 0,
    topic: 'Oxidative Phosphorylation',
    sourceContext: 'Molecular oxygen (O2) acts as the terminal electron acceptor, combining with electrons and protons to form water (H2O).',
    explanation: 'The notes state that molecular oxygen (O2) is the final electron acceptor, which combines with electrons and protons to yield water.'
  },
  {
    id: 'bio_q8',
    question: 'How does ATP synthase drive the phosphorylation of ADP into ATP during chemiosmosis?',
    options: [
      'Protons flow back into the matrix down their concentration gradient through ATP synthase',
      'Electrons directly fuse with ADP within the outer mitochondrial membrane',
      'Pyruvate pumps hydrogen ions directly out of the cytoplasm',
      'Active transport of sodium ions across the cristae drives substrate phosphorylation'
    ],
    correctOptionIndex: 0,
    topic: 'Oxidative Phosphorylation',
    sourceContext: 'Protons flow back into the matrix down their concentration gradient through ATP synthase, driving the phosphorylation of ADP to ATP (chemiosmosis).',
    explanation: 'Chemiosmosis relies on the proton-motive force: protons flow down their electrochemical gradient through ATP synthase into the matrix.'
  },
  {
    id: 'bio_q9',
    question: 'What is the primary function of lactic acid fermentation in animal muscle cells when oxygen is depleted?',
    options: [
      'To reduce pyruvate to lactate, thereby regenerating NAD+ to sustain glycolysis',
      'To generate 30 additional ATP molecules through anaerobic phosphorylation',
      'To oxidize ethanol into acetyl-CoA for the Krebs cycle',
      'To transfer hydrogen ions into the mitochondrial matrix'
    ],
    correctOptionIndex: 0,
    topic: 'Fermentation',
    sourceContext: 'Lactic Acid Fermentation: Occurs in animal muscle cells... pyruvate is reduced to lactate, regenerating NAD+.',
    explanation: 'Under anaerobic conditions, lactic acid fermentation regenerates NAD+ so that glycolysis can continue producing ATP.'
  },
  {
    id: 'bio_q10',
    question: 'What is the end product of alcoholic fermentation in yeast cells?',
    options: [
      'Ethanol and CO2',
      'Lactic acid and oxygen',
      'Acetyl-CoA and water',
      'Oxaloacetate and ATP'
    ],
    correctOptionIndex: 0,
    topic: 'Fermentation',
    sourceContext: 'Pyruvate is converted into ethanol and CO2, regenerating NAD+ to sustain glycolysis.',
    explanation: 'In yeast cells, alcoholic fermentation converts pyruvate into ethanol and CO2 while regenerating NAD+.'
  },
  {
    id: 'bio_q11',
    question: 'Where is the electron transport chain (ETC) physically located in eukaryotic cells?',
    options: [
      'Inner mitochondrial membrane (cristae)',
      'Outer mitochondrial membrane',
      'Cytoplasmic matrix',
      'Nuclear envelope pores'
    ],
    correctOptionIndex: 0,
    topic: 'Oxidative Phosphorylation',
    sourceContext: 'Location: Inner mitochondrial membrane (cristae).',
    explanation: 'Oxidative phosphorylation and the electron transport chain are embedded in the inner mitochondrial membrane.'
  },
  {
    id: 'bio_q12',
    question: 'Into which compartment are protons pumped by Complexes I through IV in the mitochondria?',
    options: [
      'From the mitochondrial matrix into the intermembrane space',
      'From the cytoplasm into the nucleus',
      'From the intermembrane space into the blood stream',
      'From the cristae into the outer endoplasmic reticulum'
    ],
    correctOptionIndex: 0,
    topic: 'Oxidative Phosphorylation',
    sourceContext: 'Complexes I through IV driving protons (H+) from the mitochondrial matrix into the intermembrane space.',
    explanation: 'The electron transport chain actively pumps protons from the matrix into the intermembrane space to establish a gradient.'
  },
  {
    id: 'bio_q13',
    question: 'What is the estimated theoretical maximum net ATP yield per glucose molecule from complete cellular respiration?',
    options: [
      'Roughly 30 to 32 ATP',
      'Exactly 100 ATP',
      'Only 2 ATP',
      'Between 12 to 14 ATP'
    ],
    correctOptionIndex: 0,
    topic: 'ATP Yield',
    sourceContext: 'bringing the theoretical maximum net ATP per glucose to roughly 30 to 32 ATP.',
    explanation: 'The notes state the theoretical maximum net ATP produced per molecule of glucose is approximately 30 to 32 ATP.'
  },
  {
    id: 'bio_q14',
    question: 'Which coenzymes function as high-energy electron carriers to transport reducing equivalents to the ETC?',
    options: [
      'NADH and FADH2',
      'Coenzyme Q10 and ATP synthase',
      'Glucose and Pyruvate',
      'Insulin and Glucagon'
    ],
    correctOptionIndex: 0,
    topic: 'Electron Carriers',
    sourceContext: 'NADH and FADH2 serve as high-energy electron carriers that transport reducing equivalents to the electron transport chain.',
    explanation: 'NADH and FADH2 accept electrons during earlier catabolic steps and deliver them to the electron transport chain.'
  },
  {
    id: 'bio_q15',
    question: 'What causes the electron transport chain to stall in the absence of molecular oxygen?',
    options: [
      'NADH cannot be oxidized back to NAD+ without a terminal electron acceptor',
      'Glucose molecules cannot enter the cell cytoplasm',
      'ATP synthase reverses and hydrolyzes all cellular enzymes',
      'Lactate molecules block mitochondrial transport pores'
    ],
    correctOptionIndex: 0,
    topic: 'Fermentation',
    sourceContext: 'In the absence of oxygen, the ETC cannot oxidize NADH back to NAD+.',
    explanation: 'Without oxygen to accept electrons at the end of the chain, electron carriers remain reduced and the ETC cannot accept further electrons.'
  }
];

export const OS_QUESTIONS: QuizQuestion[] = [
  {
    id: 'os_q1',
    question: 'What is the primary architectural purpose of virtual memory in modern operating systems?',
    options: [
      'To provide each process with an isolated, contiguous address space and shield physical RAM',
      'To eliminate the need for CPU caches and registers',
      'To replace hard drive storage with volatile cache memory',
      'To allow processes to directly modify other programs memory without kernel supervision'
    ],
    correctOptionIndex: 0,
    topic: 'Virtual Memory Architecture',
    sourceContext: 'Virtual memory provides each process with an isolated, contiguous address space, shielding physical RAM and preventing processes from accessing each others memory.',
    explanation: 'Virtual memory gives every process the illusion of its own private memory address space while safeguarding physical hardware.'
  },
  {
    id: 'os_q2',
    question: 'In paging architectures, what is the typical fixed size of a virtual page?',
    options: [
      '4 KB',
      '64 MB',
      '1 GB',
      '128 bytes'
    ],
    correctOptionIndex: 0,
    topic: 'Paging Mechanism',
    sourceContext: 'Virtual memory is partitioned into fixed-size chunks called virtual pages (typically 4 KB).',
    explanation: 'Standard virtual memory architectures divide memory into fixed-size 4 KB virtual pages.'
  },
  {
    id: 'os_q3',
    question: 'What is the purpose of the Translation Lookaside Buffer (TLB)?',
    options: [
      'A high-speed hardware cache on the CPU that stores recent virtual-to-physical address mappings',
      'A disk sector that holds the entire swap space partition',
      'A software queue that orders multi-threaded task priorities',
      'A network protocol for remote memory synchronization'
    ],
    correctOptionIndex: 0,
    topic: 'Virtual Memory Architecture',
    sourceContext: 'Translation Lookaside Buffer (TLB): A high-speed hardware cache located on the CPU chip that stores recent virtual-to-physical address mappings.',
    explanation: 'The TLB caches recent translations directly on the processor to avoid slow page table lookups in RAM.'
  },
  {
    id: 'os_q4',
    question: 'What condition triggers a page fault in an operating system?',
    options: [
      'Referencing a virtual page that has a valid mapping but is not currently resident in physical RAM',
      'A process attempting to divide an integer by zero',
      'Physical RAM failing due to a hardware thermal spike',
      'A thread releasing a mutex lock before acquiring it'
    ],
    correctOptionIndex: 0,
    topic: 'Page Faults',
    sourceContext: 'Page Fault: Occurs when a program references a virtual page that has a valid mapping in the page table but is not currently resident in physical RAM...',
    explanation: 'A page fault occurs when an instruction references a valid virtual address whose contents have been paged out to secondary storage.'
  },
  {
    id: 'os_q5',
    question: 'What is thrashing in the context of operating system memory management?',
    options: [
      'When the OS spends the majority of its time swapping pages in and out because working sets exceed RAM',
      'A thread continuously polling an unlocked mutex variable',
      'Multiple processes contending for access to a high-speed GPU',
      'When the CPU frequency oscillates rapidly to avoid overheating'
    ],
    correctOptionIndex: 0,
    topic: 'Thrashing',
    sourceContext: 'Thrashing: Occurs when the collective working sets of all running processes exceed available physical memory. The OS spends the vast majority of its time swapping pages in and out...',
    explanation: 'Thrashing paralyzes system performance because physical RAM is insufficient, forcing constant swap I/O operations.'
  },
  {
    id: 'os_q6',
    question: 'Which algorithm was developed by Edsger Dijkstra to prevent system deadlocks by evaluating state safety?',
    options: [
      'Banker\'s Algorithm',
      'Round Robin Scheduling',
      'Shortest Job First',
      'Dijkstra\'s Shortest Path Algorithm'
    ],
    correctOptionIndex: 0,
    topic: 'Deadlock Prevention',
    sourceContext: 'Bankers Algorithm: Developed by Edsger Dijkstra to prevent deadlock by checking state safety before granting resource requests.',
    explanation: 'The Bankers Algorithm dynamically checks whether allocating requested resources leaves the system in a safe state.'
  },
  {
    id: 'os_q7',
    question: 'Which of the following is NOT one of the four Coffman conditions required for a deadlock to occur?',
    options: [
      'Preemptive Resource Allocation',
      'Mutual Exclusion',
      'Hold and Wait',
      'Circular Wait'
    ],
    correctOptionIndex: 0,
    topic: 'Deadlock Conditions',
    sourceContext: 'Deadlock can occur if and only if all four conditions hold: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
    explanation: 'The Coffman condition is "No Preemption" (resources cannot be forcibly taken); having preemptive allocation actually prevents deadlocks.'
  },
  {
    id: 'os_q8',
    question: 'What hardware component performs the virtual-to-physical address translation in real time?',
    options: [
      'Memory Management Unit (MMU)',
      'Direct Memory Access (DMA) controller',
      'Arithmetic Logic Unit (ALU)',
      'Floating Point Unit (FPU)'
    ],
    correctOptionIndex: 0,
    topic: 'Virtual Memory Architecture',
    sourceContext: 'The Memory Management Unit (MMU) performs hardware translation.',
    explanation: 'The MMU is the dedicated hardware unit on the chip responsible for resolving virtual memory addresses into physical addresses.'
  },
  {
    id: 'os_q9',
    question: 'What is the effect of calling wait() or P() on a counting semaphore?',
    options: [
      'It decrements the integer count and blocks the thread if the value becomes negative',
      'It increments the integer count and immediately awakens all sleeping threads',
      'It clears all threads from the CPU scheduling queue',
      'It terminates the parent process and releases system sockets'
    ],
    correctOptionIndex: 0,
    topic: 'Process Synchronization',
    sourceContext: 'P() or wait() decrements the count and blocks if negative; V() or signal() increments the count and awakens a sleeping thread.',
    explanation: 'In counting semaphores, wait() decrements the value, blocking the thread if no resource permits are available.'
  },
  {
    id: 'os_q10',
    question: 'What defines a race condition in concurrent software systems?',
    options: [
      'Concurrent threads read and write shared data without synchronization, producing non-deterministic outcomes',
      'Two threads executing code at different clock speeds on separate CPU cores',
      'A network packet arriving before an acknowledgment frame is dispatched',
      'A process exceeding its allocated virtual memory page table limit'
    ],
    correctOptionIndex: 0,
    topic: 'Process Synchronization',
    sourceContext: 'Race Condition: A situation where multiple concurrent threads read and write shared data without synchronization, causing non-deterministic or corrupted outcomes.',
    explanation: 'A race condition arises when output depends on arbitrary thread scheduling timing because shared state is unprotected.'
  }
];

export const MONETARY_POLICY_QUESTIONS: QuizQuestion[] = [
  {
    id: 'econ_q1',
    question: 'What annualized inflation target do modern central banks (such as the Fed and ECB) typically aim to maintain?',
    options: [
      'Approximately 2%',
      '0% absolute zero inflation',
      'Between 7% and 9%',
      'Deflation of -1.5%'
    ],
    correctOptionIndex: 0,
    topic: 'Inflation Targeting',
    sourceContext: 'The primary goal of most modern central banks... is price stability, typically defined as maintaining an inflation target of approximately 2% annualized.',
    explanation: 'Central banks establish an inflation target near 2% annualized to anchor public expectations while maintaining price stability.'
  },
  {
    id: 'econ_q2',
    question: 'According to the Phillips Curve, what short-run relationship exists between inflation and unemployment?',
    options: [
      'An inverse relationship where lower unemployment can stimulate higher inflation',
      'A direct proportional relationship where unemployment and inflation rise together',
      'Zero mathematical correlation under any economic regime',
      'An exponential curve where inflation only occurs when unemployment exceeds 20%'
    ],
    correctOptionIndex: 0,
    topic: 'Macroeconomic Principles',
    sourceContext: 'Phillips Curve: Short-run inverse relationship between inflation and unemployment; lowering unemployment below natural levels can stimulate wage inflation.',
    explanation: 'The Phillips Curve demonstrates that in the short run, driving unemployment below its natural rate exerts upward pressure on wages and inflation.'
  },
  {
    id: 'econ_q3',
    question: 'What occurs when a central bank conducts expansionary Open Market Operations (OMO) by buying government securities?',
    options: [
      'It injects cash reserves into the banking system and exerts downward pressure on interest rates',
      'It drains liquidity from commercial banks and causes interest rates to increase',
      'It raises the mandatory statutory reserve ratio for commercial lenders',
      'It forces the federal government to default on outstanding treasury bonds'
    ],
    correctOptionIndex: 0,
    topic: 'Open Market Operations',
    sourceContext: 'Buying bonds injects reserves and lowers rates (expansionary); selling bonds drains liquidity and raises rates (contractionary).',
    explanation: 'Buying securities injects fresh liquid reserves into commercial bank accounts, increasing supply and lowering short-term interest rates.'
  },
  {
    id: 'econ_q4',
    question: 'What is Quantitative Easing (QE) and when is it typically deployed?',
    options: [
      'Large-scale purchases of longer-term bonds when policy rates reach the zero lower bound',
      'Printing physical dollar bills to hand out directly to retail shoppers',
      'Increasing short-term benchmark rates to stop hyperinflation',
      'Shutting down commercial bank lending windows during stock market crashes'
    ],
    correctOptionIndex: 0,
    topic: 'Unconventional Monetary Policy',
    sourceContext: 'Quantitative Easing (QE): Large-scale purchases of longer-term bonds and mortgage-backed securities when short-term interest rates reach the zero lower bound (ZLB)...',
    explanation: 'QE is an unconventional policy deployed at the zero lower bound to lower longer-term borrowing costs and stimulate economic lending.'
  },
  {
    id: 'econ_q5',
    question: 'What is the commonly estimated operational time lag for monetary policy adjustments to fully impact real economic output?',
    options: [
      'Between 12 to 18 months',
      'Instantly within 24 hours of rate announcement',
      'Exactly 10 to 12 years',
      'Less than 3 business days'
    ],
    correctOptionIndex: 0,
    topic: 'Transmission Mechanism',
    sourceContext: 'Monetary policy is subject to long and variable lags, commonly estimated between 12 to 18 months before policy adjustments fully materialize...',
    explanation: 'Economic research shows policy adjustments work through long and variable lags, typically requiring 12 to 18 months to fully propagate.'
  },
  {
    id: 'econ_q6',
    question: 'How does the exchange rate channel transmit expansionary monetary policy to net exports?',
    options: [
      'Lower domestic rates cause capital outflows, depreciating the currency and making exports more competitive',
      'Higher domestic rates attract foreign currencies, driving export prices higher',
      'Lower interest rates immediately fix foreign exchange rates permanently',
      'Commercial banks ban international financial wire transfers'
    ],
    correctOptionIndex: 0,
    topic: 'Transmission Mechanism',
    sourceContext: 'Exchange Rate Channel: Lower domestic interest rates cause capital outflows, depreciating the domestic currency and stimulating net exports.',
    explanation: 'Lower interest rates encourage capital to seek higher yields elsewhere, weakening the domestic currency and boosting export competitiveness.'
  },
  {
    id: 'econ_q7',
    question: 'What is the role of the central bank\'s Discount Window?',
    options: [
      'Providing short-term collateralized liquidity to commercial banks facing temporary shortages as lender of last resort',
      'Offering retail banking discounts on personal consumer credit cards',
      'Selling government property and gold reserves at reduced prices',
      'Setting statutory price caps on consumer supermarket goods'
    ],
    correctOptionIndex: 0,
    topic: 'Conventional Policy Tools',
    sourceContext: 'Discount Window: The central bank lending facility providing short-term collateralized liquidity to commercial banks facing temporary shortages, acting as the lender of last resort.',
    explanation: 'The discount window provides emergency collateralized funding to solvent banks experiencing liquidity pinches.'
  },
  {
    id: 'econ_q8',
    question: 'What happens to the money multiplier when the central bank lowers commercial reserve requirements?',
    options: [
      'The money multiplier increases, enabling commercial banks to expand credit creation',
      'The money multiplier collapses to zero, stopping all commercial lending',
      'The money multiplier is locked by constitutional law and cannot change',
      'Commercial banks are required to hold 100% of deposits in physical vaults'
    ],
    correctOptionIndex: 0,
    topic: 'Conventional Policy Tools',
    sourceContext: 'Lowering requirements increases the money multiplier.',
    explanation: 'Lower reserve requirements free up a greater share of every deposit for lending, which amplifies credit creation via the money multiplier.'
  },
  {
    id: 'econ_q9',
    question: 'What constitutes the policy known as "Forward Guidance"?',
    options: [
      'Central bank communication regarding the anticipated future path of monetary policy to guide market expectations',
      'Issuing mandatory daily directives instructing commercial stock traders which shares to buy',
      'Auditing the tax returns of fortune 500 corporations',
      'Forecasting precise corporate earnings reports six months in advance'
    ],
    correctOptionIndex: 0,
    topic: 'Unconventional Monetary Policy',
    sourceContext: 'Forward Guidance: Communication regarding the future anticipated path of monetary policy to shape market expectations.',
    explanation: 'Forward guidance provides transparent signaling about future rate decisions to anchor investor and consumer expectations.'
  },
  {
    id: 'econ_q10',
    question: 'What are the three components of the central bank\'s traditional macroeconomic mandate?',
    options: [
      'Price stability, maximum sustainable employment, and moderate long-term interest rates',
      'High stock valuations, fixed exchange rates, and zero government debt',
      'Free trade agreements, subsidized gasoline, and universal healthcare',
      'Balanced annual federal budgets, zero imports, and gold standard adherence'
    ],
    correctOptionIndex: 0,
    topic: 'Inflation Targeting',
    sourceContext: 'macroeconomic goals: price stability, maximum sustainable employment, and moderate long-term interest rates.',
    explanation: 'The statutory dual mandate targets price stability and maximum sustainable employment, alongside moderate long-term rates.'
  }
];
