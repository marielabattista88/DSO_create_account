/**
 * Lo que muestran las dos pantallas de OTP cuando se agotan los intentos.
 *
 * UN solo banner. Antes eran dos — el bloqueo y abajo el teléfono — con la idea
 * de que meter un número dentro de un mensaje de error lo vuelve letra chica.
 * En pantalla no funcionó: dos avisos rojos y azules apilados sobre los casilleros
 * del código pesan más que el problema que describen. Con una sola frase, el
 * teléfono llega igual y la pantalla deja de gritar.
 *
 * Compartido en vez de copiado en cada pantalla porque la espera y el número no
 * pueden discrepar entre Verify Your Email y la pantalla de código del sign-in.
 *
 * Los otros dos bloqueos del portal — contraseña en Sign In, identidad en el
 * reset — siguen usando SupportNotice como banner aparte. Si se unifican también,
 * cada uno necesita su propia frase: el contexto no es el mismo.
 */

import { BannerAlert } from 'nb-flexpay-ui'
import { lockoutDuration } from '../../otp-policy'
import { ZENDESK_SUPPORT_PHONE, ZENDESK_SUPPORT_TEL } from '../../support'

export function CodeLockedNotice() {
  return (
    <BannerAlert
      show
      variant="error"
      title="Too Many Incorrect Attempts"
      /* ReactNode y no string: el teléfono va como enlace tel:, que en un móvil
         es la diferencia entre leer el número y llamar. */
      text={
        <>
          For your security, verification is paused for {lockoutDuration()}. If you need help
          sooner, call us at{' '}
          <a href={ZENDESK_SUPPORT_TEL} style={{ color: 'inherit', fontWeight: 600 }}>
            {ZENDESK_SUPPORT_PHONE}
          </a>
          .
        </>
      }
      hideCloseButton
      className="mb-4"
    />
  )
}

CodeLockedNotice.displayName = 'CodeLockedNotice'
