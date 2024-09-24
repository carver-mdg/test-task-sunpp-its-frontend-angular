export class StateLoadingItem {
  isLoading: boolean;
  isLoadingError: boolean;
  loadingErrorData?: Error;

  constructor() {
    let statePurified = StateLoadingItem.reset();
    this.isLoading = statePurified.isLoading;
    this.isLoadingError = statePurified.isLoadingError;
  }

  static reset(): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: false,
      loadingErrorData: undefined,
    }
  }

  static loading(): StateLoadingItem {
    return {
      isLoading: true,
      isLoadingError: false
    }
  }

  static error(err: any): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: true,
      loadingErrorData: err
    }
  }

  static complete(): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: false
    }
  }
}