declare namespace JSX {
  interface IntrinsicElements {
    "altcha-widget": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      challenge?: string;
      auto?: string;
      hidefooter?: boolean;
      hideprivacy?: boolean;
      language?: string;
    };
  }
}