-- ========================================================================
-- J.K. Industries — Admin User Seed Migration
-- Supabase Migration: 002_create_admin_user.sql
-- ========================================================================
-- Target Admin:
--   Email:    jkindustries1905@gmail.com
--   Password: jkindustries1905@gmail.com
--
-- This script safely inserts or updates the administrator account in
-- Supabase's auth.users and auth.identities tables with bcrypt hashing,
-- auto-confirmed email, and authenticated permissions.
-- ========================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_email TEXT := 'jkindustries1905@gmail.com';
  v_password TEXT := 'jkindustries1905@gmail.com';
  existing_id UUID;
BEGIN
  -- Check if user already exists in auth.users
  SELECT id INTO existing_id FROM auth.users WHERE email = v_email;

  IF existing_id IS NULL THEN
    -- 1. Insert user into auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf', 10)),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"name": "J.K. Industries Admin", "role": "admin"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- 2. Link identity in auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_user_id,
      format('{"sub": "%s", "email": "%s"}', v_user_id::text, v_email)::jsonb,
      'email',
      v_user_id::text,
      NOW(),
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Admin user % successfully created with UUID %', v_email, v_user_id;
  ELSE
    -- If user already exists, update password and confirm email
    UPDATE auth.users
    SET
      encrypted_password = crypt(v_password, gen_salt('bf', 10)),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW(),
      raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb,
      raw_user_meta_data = '{"name": "J.K. Industries Admin", "role": "admin"}'::jsonb
    WHERE id = existing_id;

    -- Ensure identity exists
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = existing_id) THEN
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        existing_id,
        existing_id,
        format('{"sub": "%s", "email": "%s"}', existing_id::text, v_email)::jsonb,
        'email',
        existing_id::text,
        NOW(),
        NOW(),
        NOW()
      );
    END IF;

    RAISE NOTICE 'Admin user % exists. Password and confirmation refreshed.', v_email;
  END IF;
END $$;
