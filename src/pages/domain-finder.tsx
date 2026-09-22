import { Input } from "@/components/ui/input";
import "../assets/css/domain-finder.scss";
import RoamingImages from "@/components/ui/RoamingImages";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { fetchDomainData, getTLDs } from "@/services/common.service";
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
} from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner";
import RadialMenu from "@/components/ui/RadialMenu";
import JokeBanner from "@/components/ui/JokeBanner";
import NavigationMenuComp from "@/components/ui/NavigationMenu";

const DomainFinder = () => {
    const { control, watch, setValue } = useForm({
        defaultValues: {
            "domain-search": "",
        },
    })
    const [tlds, setTlds] = useState<any>([]);

    const [TLDvalue, setTLDValue] = useState<string[]>([])

    const [fetchingDomains, setFetchingDomains] = useState<boolean>(false)

    const [domainResults, setDomainResults] = useState<any[]>([]);

    useEffect(() => {
        getTLDs().then((val) => {
            setTlds(
                val
            )
        })
    }, [])


    const doaminField = watch("domain-search")

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const findDomain = async () => {
        if (!doaminField || !TLDvalue.length) return;

        setFetchingDomains(true);

        try {
            const generatedDomainList = TLDvalue.map(
                (item) => `${doaminField}.${item}`
            );

            const result = await fetchDomainData({
                domains: generatedDomainList,
            });

            console.log(result);

            setDomainResults(result || []);
        } catch (error) {
            console.error("Failed to fetch domain data", error);
            setDomainResults([]);
        } finally {
            setFetchingDomains(false);
        }
    };

    return (
        <>
            <div className="main-cont">


                {/* Background logos */}
                <div className="company-logo-cont">
                    <RoamingImages />
                </div>

                {/* Blur layer */}
                <div className="frosted-glass" />

                {/* Main content */}

                <div className="page-content">
                    <div className="content">
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
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
                                        setValue("domain-search", sanitizedValue)

                                    }}
                                    autoComplete="off"
                                    placeholder="What's your million-dollar domain?"
                                    className="input-domain"
                                />
                            )}
                        />

                        {/* combobox */}
                        {
                            <div className="max-w-xl">
                                <Combobox
                                    items={tlds}
                                    multiple
                                    value={TLDvalue}
                                    onValueChange={setTLDValue}
                                >
                                    <ComboboxChips>
                                        <ComboboxValue>
                                            {TLDvalue.slice(0, 3).map((item) => (
                                                <ComboboxChip key={item} className="cursor-pointer">
                                                    {item}
                                                </ComboboxChip>
                                            ))}

                                            {TLDvalue.length > 3 && (
                                                <span className="flex h-[calc(--spacing(5.5))] items-center rounded-4xl bg-muted-foreground/10 px-2 text-xs font-medium text-muted-foreground">
                                                    +{TLDvalue.length - 3}
                                                </span>
                                            )}
                                        </ComboboxValue>
                                        <ComboboxChipsInput placeholder="Add extensions" />
                                    </ComboboxChips>
                                    <ComboboxContent>
                                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item.tld} value={item.tld}>
                                                    {item.tld}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                        }

                        <div className="flex gap-4">
                            {doaminField && domainResults.length === 0 &&
                                <Button disabled={fetchingDomains} onClick={findDomain}>Find
                                    {
                                        fetchingDomains && (
                                            <Spinner data-icon="inline-start" />
                                        )
                                    }
                                </Button>
                            }

                            {domainResults.length > 0 && (
                                <Button type="button" variant={"outline"} onClick={() => {
                                    setDomainResults([]);
                                    setValue("domain-search", "");
                                }}>Reset
                                </Button>
                            )}


                        </div>

                        {domainResults.length > 0 && (
                            <div className="domain-results">
                                {domainResults.map((domain) => (
                                    <div className="domain-result-card" key={domain.domain}>

                                        {/* LEFT - DOMAIN */}
                                        <div className="domain-result-info">
                                            <div className="domain-name">
                                                <span className="domain-main">
                                                    {domain.domain.split(".")[0]}
                                                </span>
                                                <span className="domain-tld">
                                                    .{domain.tld}
                                                </span>
                                            </div>

                                            <span
                                                className={`domain-status ${domain.status}`}
                                            >
                                                {domain.status}
                                            </span>
                                        </div>

                                        {/* SEPARATOR */}
                                        <div className="domain-divider" />

                                        {/* VENDORS */}
                                        <div className="vendor-list">
                                            {domain.prices?.map((vendor: any) => (
                                                <div
                                                    className="vendor-price"
                                                    key={vendor.vendor}
                                                >
                                                    <div className="vendor-name">
                                                        {vendor.vendor}
                                                    </div>

                                                    <div className="vendor-price-value">
                                                        ${vendor.registration.toFixed(2)}
                                                        <span>/yr</span>
                                                    </div>

                                                    <div className="vendor-renewal">
                                                        Renewal ${vendor.renewal.toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* RIGHT ACTION */}
                                        {
                                            domain.status !== 'taken' && (
                                                <div className="domain-action">
                                                    <Button
                                                    >
                                                        Buy
                                                    </Button>
                                                </div>
                                            )
                                        }

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <RadialMenu items={
                [
                    "React Hook Form",
                    "GSAP Animations",
                    "Dot Sweep Domain",
                    "Joke API"
                ]
            } />
            <JokeBanner />
            <div className="absolute top-0 z-50">

                <NavigationMenuComp />
            </div>
        </>
    );
};

export default DomainFinder;