import { Form, Head, usePage } from '@inertiajs/react';
import {
    UserIcon,
    StoreIcon,
    CheckCircleIcon,
    ClockIcon,
    BuildingIcon,
    CreditCardIcon,
    FileTextIcon,
    PhoneIcon,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const [accountType, setAccountType] = useState<'customer' | 'seller'>(
        'customer',
    );
    const { props } = usePage();

    // These would come from your backend validation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const errors = props.errors || {};

    return (
        <>
            <Head title="Register" />

            <div className="flex flex-col gap-6">
                {/* Role Selection Toggle */}
                <div className="flex gap-3 rounded-xl bg-gray-100 p-1">
                    <button
                        type="button"
                        onClick={() => setAccountType('customer')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all ${
                            accountType === 'customer'
                                ? 'bg-white text-blue-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                        } `}
                    >
                        <UserIcon className="h-5 w-5" />
                        <span>Customer</span>
                        {accountType === 'customer' && (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setAccountType('seller')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all ${
                            accountType === 'seller'
                                ? 'bg-white text-purple-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                        } `}
                    >
                        <StoreIcon className="h-5 w-5" />
                        <span>Seller</span>
                        {accountType === 'seller' && (
                            <ClockIcon className="h-4 w-4 text-yellow-500" />
                        )}
                    </button>
                </div>

                {/* Info Banner based on account type */}
                {accountType === 'seller' ? (
                    <div className="rounded-lg border border-yellow-200 bg-linear-to-r from-yellow-50 to-orange-50 p-4">
                        <div className="flex items-start gap-3">
                            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-800">
                                    Seller Account Requires Review
                                </p>
                                <p className="mt-0.5 text-xs text-yellow-700">
                                    Submit your business details below. Our team
                                    will review your application within 1-3
                                    business days.
                                </p>
                            </div>
                        </div>

                        {/* Requirements list */}
                        <div className="mt-3 border-t border-yellow-200 pt-3">
                            <p className="mb-2 text-xs font-medium text-yellow-800">
                                You'll need:
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-yellow-700">
                                <div className="flex items-center gap-1">
                                    <BuildingIcon className="h-3 w-3" />
                                    <span>Business license</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CreditCardIcon className="h-3 w-3" />
                                    <span>Bank account details</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileTextIcon className="h-3 w-3" />
                                    <span>Tax ID (optional)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <PhoneIcon className="h-3 w-3" />
                                    <span>Valid phone number</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Customer Registration Form */}
                {accountType === 'customer' && (
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    <input
                                        type="hidden"
                                        name="role"
                                        value="customer"
                                    />
                                    {/* Name Field */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm font-semibold"
                                        >
                                            Full Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="John Doe"
                                            className="h-11"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-semibold"
                                        >
                                            Email Address{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="hello@example.com"
                                            className="h-11"
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Phone Field (Optional) */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="phone"
                                            className="text-sm font-semibold"
                                        >
                                            Phone Number{' '}
                                            <span className="text-xs font-normal text-gray-400">
                                                (Optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            tabIndex={3}
                                            autoComplete="tel"
                                            name="phone"
                                            placeholder="+1 234 567 8900"
                                            className="h-11"
                                        />
                                        <InputError
                                            message={errors.phone}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-semibold"
                                        >
                                            Password{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Create a strong password"
                                            className="h-11"
                                        />
                                        <InputError
                                            message={errors.password}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-sm font-semibold"
                                        >
                                            Confirm Password{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            tabIndex={5}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm your password"
                                            className="h-11"
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            required
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <Label
                                            htmlFor="terms"
                                            className="text-xs text-gray-600"
                                        >
                                            I agree to the{' '}
                                            <a
                                                href="/terms"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Terms of Service
                                            </a>{' '}
                                            and{' '}
                                            <a
                                                href="/privacy"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Privacy Policy
                                            </a>
                                        </Label>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="mt-2 h-11 w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                        tabIndex={6}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner />}
                                        {processing
                                            ? 'Creating Account...'
                                            : 'Create Customer Account →'}
                                    </Button>
                                </div>

                                {/* Login Link */}
                                <div className="text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <TextLink
                                        href={login()}
                                        tabIndex={7}
                                        className="font-semibold"
                                    >
                                        Log in
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                )}

                {/* Seller Registration Form */}
                {accountType === 'seller' && (
                    <Form
                        method="post"
                        action="/register"
                        encType="multipart/form-data"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    {/* Section: Personal Information */}
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                            <UserIcon className="h-4 w-4" />
                                            Personal Information
                                        </h3>

                                        <div className="grid gap-4">
                                            <input
                                                type="hidden"
                                                name="role"
                                                value="seller"
                                            />
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="seller_name"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Full Name{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="seller_name"
                                                    type="text"
                                                    required
                                                    name="name"
                                                    placeholder="John Doe"
                                                    className="h-10 text-secondary"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="seller_email"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Email Address{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="seller_email"
                                                    type="email"
                                                    required
                                                    name="email"
                                                    placeholder="business@example.com"
                                                    className="h-10 text-secondary"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="seller_phone"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Phone Number{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="seller_phone"
                                                    type="tel"
                                                    required
                                                    name="phone"
                                                    placeholder="+1 234 567 8900"
                                                    className="h-10 text-secondary"
                                                />
                                                <InputError
                                                    message={errors.phone}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="seller_password"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Password{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <PasswordInput
                                                    id="seller_password"
                                                    required
                                                    name="password"
                                                    placeholder="Create a password"
                                                    className="h-10 text-secondary"
                                                />
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="seller_password_confirmation"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Confirm Password{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <PasswordInput
                                                    id="seller_password_confirmation"
                                                    required
                                                    name="password_confirmation"
                                                    placeholder="Confirm password"
                                                    className="h-10 text-secondary"
                                                />
                                                <InputError
                                                    message={
                                                        errors.password_confirmation
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Store Information */}
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                            <StoreIcon className="h-4 w-4" />
                                            Store Information
                                        </h3>

                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="store_name"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Store Name{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="store_name"
                                                    type="text"
                                                    required
                                                    name="store_name"
                                                    placeholder="Amazing Electronics Store"
                                                    className="h-10 text-secondary"
                                                />
                                                <InputError
                                                    message={errors.store_name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="store_description"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Store Description{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <textarea
                                                    id="store_description"
                                                    name="store_description"
                                                    required
                                                    rows={4}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-secondary focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                    placeholder="Tell customers about your store, what products you sell, and why they should buy from you..."
                                                />
                                                <p className="text-xs text-gray-500">
                                                    Minimum 50 characters
                                                </p>
                                                <InputError
                                                    message={
                                                        errors.store_description
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Business Documents */}
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                            <FileTextIcon className="h-4 w-4" />
                                            Business Documents
                                        </h3>

                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="business_license"
                                                    className="text-sm font-semibold"
                                                >
                                                    Business License
                                                </Label>
                                                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-purple-400">
                                                    <input
                                                        type="file"
                                                        id="business_license"
                                                        name="business_license"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target
                                                                    .files?.[0];

                                                            if (file) {
                                                                // Handle file selection
                                                                const label =
                                                                    document.querySelector(
                                                                        'label[for="business_license"]',
                                                                    );

                                                                if (label) {
                                                                    label.textContent =
                                                                        file.name;
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="business_license"
                                                        className="cursor-pointer text-sm text-purple-600 hover:text-purple-700"
                                                    >
                                                        <UploadIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                                        Click to upload or drag
                                                        and drop
                                                    </label>
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        PDF, JPG, or PNG (Max
                                                        5MB)
                                                    </p>
                                                </div>
                                                <InputError
                                                    message={
                                                        errors.business_license
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="tax_id"
                                                    className="text-sm font-semibold"
                                                >
                                                    Tax ID / VAT Number
                                                </Label>
                                                <Input
                                                    id="tax_id"
                                                    type="text"
                                                    name="tax_id"
                                                    placeholder="Optional"
                                                    className="h-10"
                                                />
                                                <InputError
                                                    message={errors.tax_id}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Bank Information */}
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                            <CreditCardIcon className="h-4 w-4" />
                                            Bank Account Details
                                        </h3>

                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="bank_name"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Bank Name{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <select
                                                    id="bank_name"
                                                    name="bank_name"
                                                    required
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                >
                                                    <option value="">
                                                        Select Bank
                                                    </option>
                                                    <option value="BDO">
                                                        BDO Unibank
                                                    </option>
                                                    <option value="BPI">
                                                        Bank of the Philippine
                                                        Islands
                                                    </option>
                                                    <option value="Metrobank">
                                                        Metrobank
                                                    </option>
                                                    <option value="PNB">
                                                        Philippine National Bank
                                                    </option>
                                                    <option value="UnionBank">
                                                        UnionBank
                                                    </option>
                                                    <option value="Security Bank">
                                                        Security Bank
                                                    </option>
                                                    <option value="Chinabank">
                                                        Chinabank
                                                    </option>
                                                </select>
                                                <InputError
                                                    message={errors.bank_name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="bank_account_name"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Account Name{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="bank_account_name"
                                                    type="text"
                                                    required
                                                    name="bank_account_name"
                                                    placeholder="Name as it appears on bank account"
                                                    className="h-10 text-secondary"
                                                />
                                                <InputError
                                                    message={
                                                        errors.bank_account_name
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="bank_account_number"
                                                    className="text-sm font-semibold text-gray-900"
                                                >
                                                    Account Number{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="bank_account_number"
                                                    type="text"
                                                    required
                                                    name="bank_account_number"
                                                    placeholder="1234567890"
                                                    className="h-10 text-secondary"
                                                />
                                                <InputError
                                                    message={
                                                        errors.bank_account_number
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            id="seller_terms"
                                            required
                                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <Label
                                            htmlFor="seller_terms"
                                            className="text-xs text-gray-600"
                                        >
                                            I confirm that the information
                                            provided is accurate and I agree to
                                            the{' '}
                                            <a
                                                href="/seller-terms"
                                                className="text-purple-600 hover:underline"
                                            >
                                                Seller Terms & Conditions
                                            </a>
                                            . I understand that providing false
                                            information may result in
                                            application rejection.
                                        </Label>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="h-11 w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        {processing
                                            ? 'Submitting Application...'
                                            : 'Submit Seller Application →'}
                                    </Button>

                                    {/* Note about review process */}
                                    <div className="pb-4 text-center text-xs text-gray-500">
                                        <ClockIcon className="mr-1 inline h-3 w-3" />
                                        Applications are typically reviewed
                                        within 1-3 business days
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </div>
        </>
    );
}

// Helper component for upload icon
function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
        </svg>
    );
}

// Layout configuration
Register.layout = {
    title: 'Create an account',
    description: 'Join thousands of happy shoppers on our platform',
};
