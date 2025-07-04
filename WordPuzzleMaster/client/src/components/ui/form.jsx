"use client";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext, } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Label } from "../../components/ui/label";
const Form = FormProvider;
const FormFieldContext = React.createContext({});
const FormField = (_a) => {
    var props = __rest(_a, []);
    return (<FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props}/>
    </FormFieldContext.Provider>);
};
const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();
    const fieldState = getFieldState(fieldContext.name, formState);
    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }
    const { id } = itemContext;
    return Object.assign({ id, name: fieldContext.name, formItemId: `${id}-form-item`, formDescriptionId: `${id}-form-item-description`, formMessageId: `${id}-form-item-message` }, fieldState);
};
const FormItemContext = React.createContext({});
const FormItem = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    const id = React.useId();
    return (<FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props}/>
    </FormItemContext.Provider>);
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    const { error, formItemId } = useFormField();
    return (<Label ref={ref} className={cn(error && "text-destructive", className)} htmlFor={formItemId} {...props}/>);
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef((_a, ref) => {
    var props = __rest(_a, []);
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (<Slot ref={ref} id={formItemId} aria-describedby={!error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`} aria-invalid={!!error} {...props}/>);
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    const { formDescriptionId } = useFormField();
    return (<p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props}/>);
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef((_a, ref) => {
    var _b;
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    const { error, formMessageId } = useFormField();
    const body = error ? String((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "") : children;
    if (!body) {
        return null;
    }
    return (<p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {body}
    </p>);
});
FormMessage.displayName = "FormMessage";
export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, };
