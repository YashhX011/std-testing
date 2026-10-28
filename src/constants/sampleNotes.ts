export interface SampleNoteItem {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  content: string;
}

export const SAMPLE_NOTES: SampleNoteItem[] = [
  {
    id: 'bio-cellular-respiration',
    title: 'Cellular Respiration & ATP Bioenergetics',
    subject: 'Biology',
    difficulty: 'Medium',
    description: 'Covers Glycolysis, the Krebs cycle, electron transport chain, ATP yield, and anaerobic fermentation.',
    content: `Cellular respiration is the metabolic pathway through which biological cells break down glucose to generate adenosine triphosphate (ATP), the primary energy currency of the cell.

1. Glycolysis
- Location: Takes place directly in the cell cytoplasm and does not require oxygen (anaerobic).
- Process: One 6-carbon glucose molecule is broken down into two 3-carbon pyruvate molecules.
- Energetics: Glycolysis requires an initial investment of 2 ATP molecules and produces 4 ATP molecules through substrate-level phosphorylation, yielding a net gain of 2 ATP and 2 NADH.
- Regulation: Phosphofructokinase (PFK) acts as the key rate-limiting enzyme in glycolysis, inhibited by high levels of ATP.

2. Pyruvate Oxidation (The Link Reaction)
- Location: Mitochondrial matrix.
- Conversion: Each 3-carbon pyruvate molecule is converted into a 2-carbon acetyl group attached to Coenzyme A, forming Acetyl-CoA.
- Byproducts: One molecule of carbon dioxide (CO2) is released per pyruvate, and 1 molecule of NAD+ is reduced to NADH.

3. The Citric Acid Cycle (Krebs Cycle)
- Location: Mitochondrial matrix.
- Cycle Initiation: Acetyl-CoA (2C) combines with oxaloacetate (4C) to form citrate (6C).
- Yield per Glucose (two turns): Produces 2 ATP (or GTP), 6 NADH, 2 FADH2, and releases 4 molecules of CO2 as waste.
- Electron Carriers: NADH and FADH2 serve as high-energy electron carriers that transport reducing equivalents to the electron transport chain.

4. Oxidative Phosphorylation & Electron Transport Chain (ETC)
- Location: Inner mitochondrial membrane (cristae).
- Electron Flow: Electrons from NADH and FADH2 are transferred through Complexes I through IV, driving protons (H+) from the mitochondrial matrix into the intermembrane space.
- Proton Gradient: This creates an electrochemical proton gradient (proton-motive force) across the inner membrane.
- ATP Synthase: Protons flow back into the matrix down their concentration gradient through ATP synthase, driving the phosphorylation of ADP to ATP (chemiosmosis).
- Terminal Electron Acceptor: Molecular oxygen (O2) acts as the terminal electron acceptor, combining with electrons and protons to form water (H2O).
- Total Yield: Oxidative phosphorylation yields approximately 26 to 28 ATP, bringing the theoretical maximum net ATP per glucose to roughly 30 to 32 ATP.

5. Anaerobic Fermentation
- In the absence of oxygen, the ETC cannot oxidize NADH back to NAD+.
- Lactic Acid Fermentation: Occurs in animal muscle cells during strenuous exercise; pyruvate is reduced to lactate, regenerating NAD+.
- Alcoholic Fermentation: Occurs in yeast cells; pyruvate is converted into ethanol and CO2, regenerating NAD+ to sustain glycolysis.`
  },
  {
    id: 'cs-os-virtual-memory',
    title: 'Operating Systems: Virtual Memory & Concurrency',
    subject: 'Computer Science',
    difficulty: 'Hard',
    description: 'Detailed concepts on paging, TLBs, page faults, thrashing, semaphores, and deadlock prevention.',
    content: `Modern operating systems manage hardware resources through abstraction layers, primarily virtual memory and concurrent process scheduling.

1. Virtual Memory Architecture
- Purpose: Virtual memory provides each process with an isolated, contiguous address space, shielding physical RAM and preventing processes from accessing each other's memory.
- Paging Mechanism: Virtual memory is partitioned into fixed-size chunks called virtual pages (typically 4 KB). Physical RAM is divided into matching physical frames.
- Page Table: The OS maintains a page table per process to translate virtual addresses into physical frame addresses. The Memory Management Unit (MMU) performs hardware translation.
- Translation Lookaside Buffer (TLB): A high-speed hardware cache located on the CPU chip that stores recent virtual-to-physical address mappings. A TLB hit avoids an expensive memory lookup.

2. Page Fault Handling & Thrashing
- Page Fault: Occurs when a program references a virtual page that has a valid mapping in the page table but is not currently resident in physical RAM (marked with an invalid present-bit).
- Handling Sequence: The CPU traps to the OS kernel. The OS locates the page on secondary storage (disk/SSD swap), selects a victim frame, writes dirty pages to disk, loads the page into RAM, updates the page table, and restarts the instruction.
- Thrashing: Occurs when the collective working sets of all running processes exceed available physical memory. The OS spends the vast majority of its time swapping pages in and out rather than executing useful user-level instructions.

3. Process Synchronization & Mutexes
- Race Condition: A situation where multiple concurrent threads read and write shared data without synchronization, causing non-deterministic or corrupted outcomes.
- Critical Section: The region of code that accesses shared memory.
- Mutual Exclusion (Mutex): A locking mechanism where only one thread can acquire the lock at a given time; other threads block until it is released.
- Semaphores: Counting semaphores maintain an integer value. P() or wait() decrements the count and blocks if negative; V() or signal() increments the count and awakens a sleeping thread.

4. Deadlock Conditions (Coffman Conditions)
Deadlock can occur if and only if all four conditions hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must currently hold at least one resource and request additional resources held by other processes.
3. No Preemption: Resources cannot be forcibly seized; only released voluntarily by the holding process.
4. Circular Wait: A closed chain of processes exists where each process holds resources wanted by the next process in the cycle.
- Banker's Algorithm: Developed by Edsger Dijkstra to prevent deadlock by checking state safety before granting resource requests.`
  },
  {
    id: 'econ-monetary-policy',
    title: 'Macroeconomics: Central Banking & Monetary Policy',
    subject: 'Economics',
    difficulty: 'Medium',
    description: 'Explores interest rate transmission, quantitative easing, reserve requirements, and inflation targeting.',
    content: `Central banking systems utilize monetary policy instruments to achieve macroeconomic goals: price stability, maximum sustainable employment, and moderate long-term interest rates.

1. Dual Mandate & Inflation Targeting
- The primary goal of most modern central banks (such as the Federal Reserve and the European Central Bank) is price stability, typically defined as maintaining an inflation target of approximately 2% annualized.
- Phillips Curve: Short-run inverse relationship between inflation and unemployment; lowering unemployment below natural levels can stimulate wage inflation.

2. Conventional Monetary Policy Tools
- Policy Interest Rate: The benchmark interest rate (e.g., Federal Funds Rate) at which depository institutions trade balances held at the central bank overnight.
- Open Market Operations (OMO): The buying and selling of government securities in open markets to regulate the supply of reserves in the banking system. Buying bonds injects reserves and lowers rates (expansionary); selling bonds drains liquidity and raises rates (contractionary).
- Reserve Requirements: The mandatory minimum fraction of customer deposits that commercial banks must hold in reserve rather than lending out. Lowering requirements increases the money multiplier.
- Discount Window: The central bank lending facility providing short-term collateralized liquidity to commercial banks facing temporary shortages, acting as the lender of last resort.

3. Unconventional Monetary Policy
- Quantitative Easing (QE): Large-scale purchases of longer-term bonds and mortgage-backed securities when short-term interest rates reach the zero lower bound (ZLB), compressing term premiums and lowering long-term borrowing costs.
- Forward Guidance: Communication regarding the future anticipated path of monetary policy to shape market expectations.

4. Transmission Mechanism & Time Lags
- Interest Rate Channel: Lower policy rates reduce borrowing costs for business investment and consumer goods like mortgages and automobiles.
- Exchange Rate Channel: Lower domestic interest rates cause capital outflows, depreciating the domestic currency and stimulating net exports.
- Operational Lags: Monetary policy is subject to long and variable lags, commonly estimated between 12 to 18 months before policy adjustments fully materialize in real economic output and inflation.`
  }
];
