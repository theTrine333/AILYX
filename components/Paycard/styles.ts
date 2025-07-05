import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#3B82F620",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 15,
    paddingHorizontal: 20,
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
    flexDirection: "row",
  },
  planCard: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 24,
    width: 300,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#374151",
    position: "relative",
  },
  selectedCard: {
    borderColor: "#10B981",
    backgroundColor: "#10B98108",
  },
  popularCard: {
    borderColor: "#F59E0B",
    backgroundColor: "#F59E0B08",
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    alignSelf:"center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 7,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 1,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  planHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  planName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  planDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 28,
  },
  price: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  period: {
    fontSize: 16,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 14,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#D1D5DB",
    flex: 1,
    lineHeight: 22,
  },
  selectedIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  subscribeButton: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: "#374151",
  },
  subscribeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  terms: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  aiModelsPreview: {
    paddingTop: 20,
  },
  modelsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  modelsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  modelChip: {
    backgroundColor: "#374151",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modelText: {
    color: "#D1D5DB",
    fontSize: 13,
    fontWeight: "500",
  },
});

export default styles;
