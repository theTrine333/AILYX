import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

const PlanCard = ({
  plan,
  handleSelectPlan,
  selectedPlan,
}: {
  plan: any;
  handleSelectPlan: any;
  selectedPlan: any;
}) => {
  const isSelected = selectedPlan === plan.id;
  return (
    <TouchableOpacity
      style={[
        styles.planCard,
        isSelected && styles.selectedCard,
        plan.popular && styles.popularCard,
      ]}
      onPress={() => handleSelectPlan(plan.id)}
      activeOpacity={0.8}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Ionicons name="sparkles" size={12} color="#FFFFFF" />
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <View
          style={[styles.iconContainer, { backgroundColor: plan.color + "20" }]}
        >
          <Ionicons name={plan.icon} size={28} color={plan.color} />
        </View>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{plan.price}</Text>
        <Text style={styles.period}>/{plan.period}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature: any, index: any) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PlanCard;
