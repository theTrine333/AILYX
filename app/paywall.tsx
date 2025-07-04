import PlanCard from "@/components/Paycard";
import plans from "@/components/Paycard/plans";
import styles from "@/components/Paycard/styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const PaywallScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const handleSelectPlan = (planId: any) => {
    setSelectedPlan(planId);
  };
  const handleSubscribe = () => {
    console.log(`Subscribing to ${selectedPlan} plan`);
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="globe-outline" size={36} color="#3B82F6" />
          </View>
          <Text style={styles.title}>Choose Your AI Experience</Text>
          <Text style={styles.subtitle}>
            Unlock the power of multiple AI models in one place with AILYX
          </Text>
        </View>
        <ScrollView>
          {/* Plans */}
          <ScrollView
            style={styles.plansContainer}
            horizontal
            contentContainerStyle={{ gap: 10, paddingRight: 50 }}
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                handleSelectPlan={handleSelectPlan}
                selectedPlan={selectedPlan}
              />
            ))}
          </ScrollView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[
                styles.subscribeButton,
                selectedPlan === "free" && styles.continueButton,
              ]}
              onPress={handleSubscribe}
              activeOpacity={0.8}
            >
              <Text style={styles.subscribeText}>
                {selectedPlan === "free"
                  ? "Continue with Free"
                  : "Subscribe Now"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By subscribing, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </View>
          {/* AI Models Preview */}
          <View style={styles.aiModelsPreview}>
            <Text style={styles.modelsTitle}>Available AI Models</Text>
            <View style={styles.modelsList}>
              <View style={styles.modelChip}>
                <Ionicons name="chatbubble-outline" size={14} color="#10B981" />
                <Text style={styles.modelText}>GPT-4</Text>
              </View>
              <View style={styles.modelChip}>
                <Ionicons name="chatbubble-outline" size={14} color="#3B82F6" />
                <Text style={styles.modelText}>Claude 3</Text>
              </View>
              <View style={styles.modelChip}>
                <Ionicons name="chatbubble-outline" size={14} color="#F59E0B" />
                <Text style={styles.modelText}>Gemini Pro</Text>
              </View>
              <View style={styles.modelChip}>
                <Text style={styles.modelText}>+15 more</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PaywallScreen;
