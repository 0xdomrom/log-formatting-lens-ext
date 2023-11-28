import {Renderer} from "@k8slens/extensions";
import {observer} from "mobx-react";
import React from "react";
import {preferenceStore} from "./preference-store";

const {
  Component: {SubTitle, Switch, Input, InputValidators, Select},
} = Renderer;

@observer
export class SettingsPage extends React.Component {
  render() {
    const separatorStyle = {
      minWidth: "40px",
      minHeight: "40px",
    };
    const hintStyle = {marginTop: "8px"};

    const builtInTemplateOptions = [
      {value: "default", label: "Default"},
      {value: "raw", label: "Raw"},
      {value: "json", label: "JSON"},
      {value: "extjson", label: "Extended JSON"},
      {value: "ppextjson", label: "Pretty-print Extended JSON"},
    ];

    return (
      <section>
        <SubTitle title="Max Log Requests"/>
        <Input
          theme="round-black"
          type="number"
          validators={InputValidators.isNumber}
          min={1}
          value={preferenceStore.maxLogRequests.toString()}
          onChange={(v) => {
            preferenceStore.maxLogRequests = Number(v);
          }}
        />
        <span style={hintStyle}>
          Maximum number of concurrent logs to request.
        </span>

        <div style={separatorStyle}></div>

        <SubTitle title="Built-in Template"/>
        <Select
          themeName="lens"
          options={builtInTemplateOptions}
          value={preferenceStore.builtInTemplate}
          onChange={(v) => {
            preferenceStore.builtInTemplate = v.value;
          }}
        />
        <span style={hintStyle}>Predefined template to use.</span>

        <div style={separatorStyle}></div>

        <SubTitle title="Custom Template"/>
        <Input
          theme="round-black"
          type="text"
          placeholder='Example: {{.PodName}} | {{.Message}}{{"\n"}}'
          value={preferenceStore.customTemplate}
          onChange={(v) => {
            preferenceStore.customTemplate = v;
          }}
        />
        <span style={hintStyle}>
          Custom template to use, leave empty to use the built-in template.
        </span>
      </section>
    );
  }
}

export class PreferenceHint extends React.Component {
  render() {
    return <span></span>;
  }
}
