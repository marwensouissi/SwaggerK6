// Creator: Grafana k6 Browser Recorder 1.0.6

import { sleep, group } from 'k6'
import http from 'k6/http'

export const options = {}

export default function main() {
  let response

  group('page_2 - https://dev-itona.xyz/signUp', function () {
    response = http.get('https://dev-itona.xyz/assets/icons/logo/dark/new-logo.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/login/eye-slash.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/favicon.ico', {
      headers: {
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.post(
      'https://dev-itona.xyz/api/noauth/signup',
      '{"email":"test@test.tn","firstName":"test","lastName":"test","password":"123123","phone":"12345678","appSecret":"6LeoAzodAAAAAGtwzzizL35nh8PqMtlveJMeTHHv"}',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/signUp',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.post(
      'https://dev-itona.xyz/api/noauth/autoLoginByEmail',
      '{"email":"test@test.tn","otpCode":123456}',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/signUp',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.get(
      'https://dev-itona.xyz/api/plugins/telemetry/TENANT/00000194-cc74-5092-0000-0194cc745092/values/attributes/SERVER_SCOPE?keys=isBigScreen',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/signUp',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'x-authorization':
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.get('https://dev-itona.xyz/api/user/00000194-cc74-50c0-0000-0194cc7450c0', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get(
      'https://dev-itona.xyz/api/user-role/user/00000194-cc74-50c0-0000-0194cc7450c0',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/signUp',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'x-authorization':
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.get('https://dev-itona.xyz/api/user/tokenAccessEnabled', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/api/edges/enabled', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/api/admin/repositorySettings/exists', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/api/ruleChain/tbelEnabled', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/api/dashboard/maxDatapointsLimit', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/signUp',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
  })

  group('page_3 - https://dev-itona.xyz/verifyCode?email=test@test.tn', function () {
    response = http.get('https://dev-itona.xyz/api/dashboard/home', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get(
      'https://dev-itona.xyz/api/tenant/dashboards?pageSize=1000&page=0&sortProperty=title&sortOrder=ASC',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'x-authorization':
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.get('https://dev-itona.xyz/api/dashboard/home', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get(
      'https://dev-itona.xyz/api/plugins/telemetry/TENANT/00000194-cc74-5092-0000-0194cc745092/values/attributes/SERVER_SCOPE',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'x-authorization':
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.post(
      'https://dev-itona.xyz/graph/v1/graphql',
      '{"operationName":"GetExperiences","variables":{},"query":"query GetExperiences {\\n  experience {\\n    id\\n    menus\\n    name\\n    experience_dashboards {\\n      dashboard_id\\n      bundle_application_id\\n      experience_dashboard_item {\\n        title\\n        additional_info\\n        dashboard_sub_folder\\n        dashboard_navbar_order_sub_folder\\n        dashboard_navbar_order\\n        dashboard_navbar_icon\\n        pin_dashboard_in_navbar\\n        additional_info\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          authorization:
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.post(
      'https://dev-itona.xyz/graph/v1/graphql',
      '{"operationName":"GetWebApplication","variables":{"tenant_id":"00000194-cc74-5092-0000-0194cc745092"},"query":"query GetWebApplication($tenant_id: uuid) {\\n  web_application(where: {tenant_id: {_eq: $tenant_id}}) {\\n    title\\n    dashboards\\n    tenant_id\\n    bundle_application {\\n      navbar_logo\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          authorization:
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.get(
      'https://dev-itona.xyz/api/plugins/telemetry/TENANT/00000194-cc74-5092-0000-0194cc745092/values/attributes/SERVER_SCOPE',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'x-authorization':
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.get('https://dev-itona.xyz/5413.4deda050cac5e7f7b2f6.js', {
      headers: {
        referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/api/user/00000194-cc74-50c0-0000-0194cc7450c0', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/api/dashboard/home', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/verifyCode?email=test@test.tn',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
  })

  group('page_4 - https://dev-itona.xyz/home', function () {
    response = http.get(
      'https://dev-itona.xyz/api/plugins/telemetry/TENANT/00000194-cc74-5092-0000-0194cc745092/values/attributes/SERVER_SCOPE',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/home',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'x-authorization':
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.post(
      'https://s3.dev-itona.xyz:9000/?Action=AssumeRoleWithCustomToken&Token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg&Version=2011-06-15&DurationSeconds=86000&RoleArn=arn:minio:iam:::role/idmp-itonas3storage',
      '{}',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.options(
      'https://s3.dev-itona.xyz:9000/?Action=AssumeRoleWithCustomToken&Token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg&Version=2011-06-15&DurationSeconds=86000&RoleArn=arn:minio:iam:::role/idmp-itonas3storage',
      null,
      {
        headers: {
          accept: '*/*',
          'access-control-request-headers': 'content-type',
          'access-control-request-method': 'POST',
          origin: 'https://dev-itona.xyz',
          'sec-fetch-mode': 'cors',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        },
      }
    )

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/collaps-icon.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/logo/dark/new-logo-close-sidebar.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/hand.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/3dcube.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/global.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/arrows.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/mobile.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/devices.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/annotation.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/modal-training.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/compute-device.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/video-analytics-chain.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/buckets.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/resources-library.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/ota-updates.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/people.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/role.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/customers.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/notification-box.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/notification-alert.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/notification-trigger.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/notification-recipient.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/notification-template.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/event_note.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/dashboards.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/settings.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/classes.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/devices_other.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/domain.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/library.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/history.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/folder.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/manage_history.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/settings_backup_restore.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/settings_ethernet.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/sidebar/usage.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/logo/dark/open-sidebar-logo.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get(
      'https://dev-itona.xyz/api/plugins/telemetry/TENANT/00000194-cc74-5092-0000-0194cc745092/values/attributes/SERVER_SCOPE',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          referer: 'https://dev-itona.xyz/home',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
          'x-authorization':
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
          'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )

    response = http.get('https://dev-itona.xyz/api/tenant/00000194-cc74-5092-0000-0194cc745092', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'x-authorization':
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QudG4iLCJ1c2VySWQiOiIwMDAwMDE5NC1jYzc0LTUwYzAtMDAwMC0wMTk0Y2M3NDUwYzAiLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInNlc3Npb25JZCI6IjdiZGZmYzNhLTNiOGQtNDFjMi1iYWEzLTBhZTdlYThlYjdhZCIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4NTk2OTcyLCJleHAiOjE3Mzg3Njk3NzIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMDAwMDAxOTQtY2M3NC01MDkyLTAwMDAtMDE5NGNjNzQ1MDkyIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.IthEuGaGtSw10o9EqMndNCG8lHQsHxFAc2qKrlY87c3Xo0Ued9YSfoQ3aLtnZ6Oa_nT7L75EiSRdXQnjpEhjOg',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/welcome/cercle.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/welcome/3dcube.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/welcome/global.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/welcome/programming-arrows.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })

    response = http.get('https://dev-itona.xyz/assets/icons/welcome/mobile.svg', {
      headers: {
        referer: 'https://dev-itona.xyz/home',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0',
        'sec-ch-ua': '"Opera";v="116", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
  })

  // Automatically added sleep
  sleep(1)
}
