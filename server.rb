# from: http://blog.ericwhite.ca/articles/2009/06/testing-modular-javascript-with-jsunit-and-thin_rack/
root=Dir.pwd + "/public"
puts ">>> Serving: #{root}"


#
# A list of regular expressions which if
# matched will be cached by the browser.
#
ALLOWED_FOR_CACHING=[]
 
class NonCachingFile < Rack::File
  def serving
    response = super
    ALLOWED_FOR_CACHING.each do |re|
      return response if @path =~ re
    end
 
    #
    # Don't cache included files from
    # our website neither in the unit test, or
    # functional tests or in the application
    # itself.
    http_headers = response[1]
    http_headers["Cache-Control"] = "no-cache"
 
    response
  end
end
 
app = Rack::Builder.new {
  use Rack::CommonLogger
  run Rack::Directory.new("#{root}", NonCachingFile.new("#{root}"))
}
 
# Return the app with the same name as this
# rackup configuration file.
#
#   For implementation details see and while the name must
#   match the name of the ruby file see:
#
#     thin/controllers/controller.rb:load_rackup_config
Server = app
