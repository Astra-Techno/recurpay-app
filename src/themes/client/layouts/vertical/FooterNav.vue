<template>
    <footer class="bg-gray-100 text-gray-700 border-t mt-10">
        <div class="container mx-auto max-w-screen-xl px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <!-- Branding -->
            <div>

                <div class="flex items-center space-x-2 px-2">
                    <Icon name="IconMinimal" class="cursor-pointer w-[30px] h-[30px]" />

                    <div>
                        <h1 class="font-black italic cursor-pointer leading-none">MyProps</h1>
                        <span class="text-[8px] font-bold text-right block leading-none tracking-widest">
                            Rent.Pay.Go.
                        </span>
                    </div>
                </div>

            </div>

            <!-- Explore -->
            <div>
                <h4 class="font-semibold mb-3">Explore</h4>
                <ul class="space-y-1">
                    <li>
                        <RouterLink to="/properties" class="hover:text-primary">Browse Properties</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/dashboard" class="hover:text-primary">Dashboard</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/contact" class="hover:text-primary">Contact Us</RouterLink>
                    </li>
                </ul>
            </div>

            <!-- Resources -->
            <div>
                <h4 class="font-semibold mb-3">Resources</h4>
                <ul class="space-y-1">
                    <li>
                        <RouterLink to="/faq" class="hover:text-primary">FAQs</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/privacy" class="hover:text-primary">Privacy Policy</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/terms" class="hover:text-primary">Terms & Conditions</RouterLink>
                    </li>
                </ul>
            </div>

            <!-- Social & Newsletter -->
            <div>
                <h4 class="font-semibold mb-3">Connect with us</h4>
                <div class="flex space-x-3 mb-4">
                    <a href="#" class="hover:text-primary">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M22.46 6c-.77.35-1.6.58-2.46.69a4.24 4.24 0 001.88-2.34 8.51 8.51 0 01-2.7 1.03A4.22 4.22 0 0015.5 4c-2.33 0-4.22 1.89-4.22 4.22 0 .33.04.66.1.97A11.98 11.98 0 013 5.13a4.22 4.22 0 001.31 5.63 4.18 4.18 0 01-1.91-.53v.05c0 2.1 1.5 3.85 3.49 4.25a4.22 4.22 0 01-1.9.07 4.23 4.23 0 003.95 2.93A8.47 8.47 0 012 19.54a11.94 11.94 0 006.48 1.9c7.79 0 12.06-6.46 12.06-12.06l-.01-.55A8.48 8.48 0 0024 4.59a8.38 8.38 0 01-2.54.7z" />
                        </svg>
                    </a>
                    <a href="#" class="hover:text-primary">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.75 2.24 5 5 5h14c2.75 0 5-2.25 5-5v-14c0-2.76-2.25-5-5-5zm-10 20h-3v-9h3v9zm-1.5-10.3c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.3h-3v-4.5c0-1.08-.92-2-2-2s-2 .92-2 2v4.5h-3v-9h3v1.23c.67-.98 1.75-1.73 3-1.73 2.22 0 4 1.78 4 4v5.5z" />
                        </svg>
                    </a>
                    <!-- Add more icons as needed -->
                </div>
                <p class="text-xs text-gray-500">© 2025 MyProps. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>