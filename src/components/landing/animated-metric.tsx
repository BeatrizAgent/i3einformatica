type AnimatedMetricProps = {
  value: string;
  label?: string;
};

export function AnimatedMetric({ value, label }: AnimatedMetricProps) {
  return <span aria-label={`${value}${label ? ` ${label}` : ""}`}>{value}</span>;
}
