<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthDebugChecker
{
    public function handle(Request $request, Closure $next)
    {
        if (config('app.debug')) {
            logger()->info('AUTH DEBUG', [
                'user' => Auth::user(),
                'auth_id' => Auth::id(),
                'request_user' => $request->user(),
                'guard' => Auth::getDefaultDriver(),
                'session_id' => session()->getId(),
                'has_session_user' => session()->has('user_id'),
                'url' => $request->fullUrl(),
                'method' => $request->method(),
            ]);
        }

        return $next($request);
    }
}