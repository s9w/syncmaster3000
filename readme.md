# Syncmaster 3000
This is a little web tool to help construct and reason about Vulkan synchronization dependencies. If you don't know what that is, turn around and run.

It does most of the VUID checks from the spec and has a few more tricks up its sleeve. For example:

- it warns about empty dependencies (from `TOP_OF_PIPE` to `BOTTOM_OF_PIPE`)
- it warns about `_READ_BIT` access masks in the source scope
- it warns about subpass dependencies
- it even has a flashing title!

This is not yet about the synchronization2 extension by the way.