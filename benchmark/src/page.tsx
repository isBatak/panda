import { css } from '@/styled-system/css'
import { Flex, Box, Container, panda } from '@/styled-system/jsx'

export default function Page() {
  return (
    <html
      lang="en"
      className={css({ overflowX: 'hidden', fontFamily: 'body', fontSize: '0.9em' })}
      suppressHydrationWarning
    >
      <body className={css({ overflowX: 'hidden', overflowY: 'auto' })}>
        <panda.div position="absolute" top="6" width="full" zIndex="10">
          <Container>
            <Box display={{ base: 'none', md: 'block' }}>
              {/* <DesktopNavBar /> */}
            </Box>
            <Box display={{ md: 'none' }}>
              {/* <MobileNavBar /> */}
            </Box>
          </Container>
        </panda.div>

        <Flex direction="column">

        </Flex>

        {/* <SectionFooter /> */}
      </body>
    </html>
  )
}
