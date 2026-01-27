import React from 'react';
import { Check, Zap, Shield, Crown, Cloud } from 'lucide-react';

const BuyStorage = () => {
    const plans = [
        {
            name: 'Free',
            price: '0',
            storage: '15 GB',
            features: ['Basic file sharing', 'Standard security', 'Mobile app access', 'Ad-supported'],
            icon: Cloud,
            color: 'slate',
            cta: 'Current Plan',
            popular: false
        },
        {
            name: 'Pro',
            price: '9.99',
            storage: '100 GB',
            features: ['Advanced sharing', 'Enhanced security', 'Priority support', 'Ad-free experience', 'File versioning'],
            icon: Zap,
            color: 'primary',
            cta: 'Upgrade to Pro',
            popular: true
        },
        {
            name: 'Premium',
            price: '19.99',
            storage: '1 TB',
            features: ['Collaborative tools', 'Enterprise security', '24/7 VIP support', 'Custom expiration links', 'Advanced analytics'],
            icon: Crown,
            color: 'purple',
            cta: 'Get Premium',
            popular: false
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Choose your plan</h1>
                <p className="text-slate-500 max-w-lg mx-auto">Get the storage you need with features that help you stay productive and secure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`
              relative glass p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col
              ${plan.popular
                                ? 'border-primary-500 shadow-2xl shadow-primary-500/10 scale-105 z-10'
                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
            `}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}

                        <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center mb-6
              ${plan.color === 'primary' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30' :
                                plan.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                                    'bg-slate-100 text-slate-600 dark:bg-slate-800'}
            `}>
                            <plan.icon className="w-6 h-6" />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                            <span className="text-slate-500 font-medium">/month</span>
                        </div>

                        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{plan.storage}</span>
                            <span className="text-sm text-slate-500 ml-1 italic text-primary-500 block font-semibold">Storage Included</span>
                        </div>

                        <ul className="mt-8 space-y-4 flex-1">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                    <div className="mt-0.5 p-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className={`
              mt-10 w-full py-4 rounded-2xl font-bold transition-all active:scale-95
              ${plan.popular
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40 hover:bg-primary-700'
                                : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'}
            `}>
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto glass p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Need more than 1 TB?</h3>
                <p className="text-slate-500 mb-6">Contact our sales team for custom enterprise plans tailored to your needs.</p>
                <button className="text-primary-600 font-bold hover:underline">Contact Sales →</button>
            </div>
        </div>
    );
};

export default BuyStorage;
