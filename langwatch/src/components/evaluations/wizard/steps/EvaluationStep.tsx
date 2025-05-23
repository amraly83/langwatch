import { Accordion, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useEvaluationWizardStore } from "~/components/evaluations/wizard/hooks/evaluation-wizard-store/useEvaluationWizardStore";
import { CategorySelectionAccordion } from "./evaluations/CategorySelectionAccordion";
import { EvaluatorMappingAccordion } from "./evaluations/EvaluatorMappingAccordion";
import { EvaluatorSelectionAccordion } from "./evaluations/EvaluatorSelectionAccordion";
import { EvaluatorSettingsAccordion } from "./evaluations/EvaluatorSettingsAccordion";
import { useAnimatedFocusElementById } from "../../../../hooks/useAnimatedFocusElementById";
import type { Node } from "@xyflow/react";
import type { Component } from "~/optimization_studio/types/dsl";

export function EvaluationStep() {
  const {
    wizardState,
    setWizardState,
    getFirstEvaluatorNode: getFirstEvaluator,
  } = useEvaluationWizardStore(
    ({ wizardState, setWizardState, getFirstEvaluatorNode }) => ({
      wizardState,
      setWizardState,
      getFirstEvaluatorNode,
    })
  );
  const firstEvaluator: Node<Component> | undefined = getFirstEvaluator();
  const [accordeonValue, setAccordeonValue] = useState<string[]>(
    wizardState.evaluatorCategory
      ? firstEvaluator
        ? ["selection"]
        : ["settings"]
      : ["category"]
  );

  useEffect(() => {
    if (accordeonValue[0] === "mappings") {
      setWizardState({
        workspaceTab: "workflow",
      });
    }
  }, [accordeonValue, setWizardState]);

  const [isRendered, setIsRendered] = useState(false);
  const focusElementById = useAnimatedFocusElementById();

  useEffect(() => {
    if (isRendered && accordeonValue[0] === "settings") {
      focusElementById("js-next-step-button");
    }
    setIsRendered(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accordeonValue]);

  return (
    <VStack width="full" align="start" gap={4}>
      <VStack align="start" paddingTop={6}>
        <Heading as="h2" size="md">
          Evaluation Type
        </Heading>
        <Text>Choose what aspect of your LLM you want to evaluate</Text>
      </VStack>

      <Accordion.Root
        value={accordeonValue}
        onValueChange={(e: { value: string[] }) => setAccordeonValue(e.value)}
        multiple={false}
        collapsible
        width="full"
        variant="plain"
      >
        <VStack width="full" gap={3}>
          <CategorySelectionAccordion setAccordeonValue={setAccordeonValue} />
          <EvaluatorSelectionAccordion setAccordeonValue={setAccordeonValue} />
          {firstEvaluator && (
            <EvaluatorMappingAccordion
              selected={accordeonValue[0] === "mappings"}
            />
          )}
          {firstEvaluator && <EvaluatorSettingsAccordion />}
        </VStack>
      </Accordion.Root>
    </VStack>
  );
}
