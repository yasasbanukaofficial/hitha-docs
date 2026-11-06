export interface FlowNodeData {
  label: string;
  caption?: string;
  logo?: string;
  badge?: string;
  badgeColor?: string;
  accentColor?: string;
  details?: {
    className?: string;
    filePath?: string;
    config?: string;
    description: string;
  };
  // For InfoNode
  infoTitle?: string;
  infoValue?: string;
  // For DecisionNode
  question?: string;
  // For GroupNode
  groupTitle?: string;
  planeColor?: string;
}
