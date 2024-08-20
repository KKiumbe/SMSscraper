import create from 'zustand';

const useStore = create((set) => ({
  extractedData: null,
  setExtractedData: (data) => set({ extractedData: data }),
}));

export default useStore;
