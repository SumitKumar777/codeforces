
import { create } from "zustand"

type TestCase = {
   input: string;
   expected_output: string;
};

type ProblemTestcaseState = {
   testCases: TestCase[];
   setTestCases: (testCases: TestCase[]) => void;
};



const useProblemTestcaseStore = create<ProblemTestcaseState>((set) => ({
   testCases: [],
   setTestCases: (testCases: { input: string, expected_output: string }[]) => set({ testCases }),
}));

export default useProblemTestcaseStore;