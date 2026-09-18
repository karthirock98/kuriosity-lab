import { Input } from "@/components/ui/input";
import "../assets/css/domain-finder.scss";
import RoamingImages from "@/components/ui/RoamingImages";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

const DomainFinder = () => {
    const { control } = useForm({
        defaultValues: {
            "domain-search": "",
        },
    });

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="main-cont">

            {/* Background logos */}
            <div className="company-logo-cont">
                <RoamingImages />
            </div>

            {/* Blur layer */}
            <div className="frosted-glass" />

            {/* Main content */}
            <div className="page-content">
                <Controller
                    name="domain-search"
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            ref={(element) => {
                                field.ref(element);
                                inputRef.current = element;
                            }}
                            autoComplete="off"
                            placeholder="What's your million-dollar domain?"
                            className="input-domain"
                        />
                    )}
                />
            </div>

        </div>
    );
};

export default DomainFinder;