import type { FunctionalComponent, defineComponent } from 'vue';
import type { ComponentType } from '../../types/componentType';
import { componentMap } from '/@/components/Table/src/componentMap';
import { deepMerge } from '/@/utils';
import { Popover } from 'ant-design-vue';
import { h } from 'vue';

export interface ComponentProps {
  component: ComponentType;
  rule: boolean;
  popoverVisible: boolean;
  ruleMessage: string;
  getPopupContainer?: Fn;
}

export const CellComponent: FunctionalComponent = (
  {
    component = 'Input',
    rule = true,
    ruleMessage,
    popoverVisible,
    getPopupContainer,
  }: ComponentProps,
  { attrs },
) => {
  const Comp = componentMap.get(component) as typeof defineComponent;
  let params = attrs
  if (attrs.component == "DatePicker") {
    params = deepMerge({
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      format: 'YYYY-MM-DD'
    },attrs)
  }
  const DefaultComp = h(Comp, params);
  if (!rule) {
    return DefaultComp;
  }
  return h(
    Popover,
    {
      overlayClassName: 'edit-cell-rule-popover',
      visible: !!popoverVisible,
      ...(getPopupContainer ? { getPopupContainer } : {}),
    },
    {
      default: () => DefaultComp,
      content: () => ruleMessage,
    },
  );
};
